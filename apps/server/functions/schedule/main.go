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

type Schedule struct {
	Schedule []Game `json:"Schedule"`
}

type Game struct {
	Field           string `json:"field"`
	TournamentLevel string `json:"tournamentLevel"`
	Description     string `json:"description"`
	StartTime       string `json:"startTime"`
	MatchNumber     int    `json:"matchNumber"`
	Teams           []Team `json:"teams"`
}

type Team struct {
	TeamNumber int    `json:"teamNumber"`
	Station    string `json:"station"`
	Surrogate  bool   `json:"surrogate"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	fmt.Println("Req:", request.QueryStringParameters)

	// makes sure the params are all valid for the FRC api
	event := request.QueryStringParameters["event"]
	eventType := request.QueryStringParameters["type"]

	if event == "" || eventType == "" {
		return &events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Invalid Params",
		}, nil
	}

	client := &http.Client{}
	url := fmt.Sprintf("https://frc-api.firstinspires.org/v3.0/%d/schedule/%s", time.Now().Year(), event)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		return nil, err
	}

	q := req.URL.Query()
	q.Add("tournamentLevel", eventType)
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
	var scheduleStruct Schedule
	json.Unmarshal(bodyBytes, &scheduleStruct)
	body, err := json.Marshal(scheduleStruct.Schedule)

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
