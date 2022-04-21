package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Events struct {
	Events     []Event `json:"Events"`
	EventCount int     `json:"eventCount"`
}

type Event struct {
	AllianceCount string        `json:"allianceCount"`
	WeekNumber    int           `json:"weekNumber"`
	Announcements []interface{} `json:"announcements"`
	Code          string        `json:"code"`
	DivisionCode  string        `json:"divisionCode"`
	Name          string        `json:"name"`
	Type          string        `json:"type"`
	DistrictCode  string        `json:"districtCode"`
	Venue         string        `json:"venue"`
	City          string        `json:"city"`
	Stateprov     string        `json:"stateprov"`
	Country       string        `json:"country"`
	DateStart     string        `json:"dateStart"`
	DateEnd       string        `json:"dateEnd"`
	Address       string        `json:"address"`
	Website       string        `json:"website"`
	Webcasts      []string      `json:"webcasts"`
	Timezone      string        `json:"timezone"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	fmt.Println("Req:", request.QueryStringParameters)

	// makes sure the params are all valid for the FRC api
	week := request.QueryStringParameters["week"]
	team := request.QueryStringParameters["team"]

	client := &http.Client{}
	url := fmt.Sprintf("https://frc-api.firstinspires.org/v3.0/%d/events", time.Now().Year())
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		return nil, err
	}

	q := req.URL.Query()

	// generate the url based of the query params, im sure there is an easier way to do this
	if week != "" {
		q.Add("weekNumber", week)
	}
	if team != "" {
		q.Add("teamNumber", team)
	}

	req.URL.RawQuery = q.Encode()

	// make sure it returns a JSON and not a XML file
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")
	req.SetBasicAuth(os.Getenv("FRC_API_USER"), os.Getenv("FRC_API_PW"))
	res, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	bodyBytes, err := ioutil.ReadAll(res.Body)

	if err != nil {
		return nil, err
	}

	// marshalls and then unmarshal it to remove the useless tags
	// if this throws and error we now know that something is wrong with the api res, and pass that error forward
	var scheduleStruct Events
	json.Unmarshal(bodyBytes, &scheduleStruct)
	body, err := json.Marshal(scheduleStruct.Events)

	if err != nil {
		return nil, err
	}

	// if all is good we send out the result :)
	return &events.APIGatewayProxyResponse{
		StatusCode:      200,
		Headers:         map[string]string{"Content-Type": "application/json"},
		Body:            string(body),
		IsBase64Encoded: false,
	}, nil
}

func main() {
	lambda.Start(handler)
}
