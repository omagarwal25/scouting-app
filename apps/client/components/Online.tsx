import { TBAMatch } from '@griffins-scout/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useAtom } from 'jotai';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';
import { ObjectiveInfo, game, objectiveInfoSchema } from '~/models';
import {
  appSettingsAtom,
  objectiveInfoAtom,
  recordTypeAtom,
  resetAtom,
} from '~/state';
import { RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';
import { trpc } from '~/utils/trpc';
import { Button } from './Button';
import { FieldInput } from './input/FieldInput';
import { InputWrapper } from './input/InputWrapper';

const getTeamFromMatch = (
  match: TBAMatch,
  scoutId: ObjectiveInfo['scoutId']
) => {
  const alliance = scoutId.includes('red')
    ? match.alliances.red.team_keys
    : match.alliances.blue.team_keys;
  const index = parseInt(scoutId.split(' ')[1]) - 1;
  return parseInt(alliance[index].replace('frc', ''));
};

export const Online = ({
  navigation,
}: {
  navigation: RootTabScreenProps['navigation'];
}) => {
  const [settings, setAppSettings] = useAtom(appSettingsAtom);
  const [info, setInfo] = useAtom(objectiveInfoAtom);

  if (settings.connection !== 'online') return <></>;

  return (
    <>
      {!settings.scoutId && <ScoutIdSelect />}
      {settings.scoutId && (
        <InputWrapper label={`Scout ID: ${settings.scoutId}`}>
          <Button
            label="Change Scout ID"
            onPress={() =>
              setAppSettings((settings) => ({ ...settings, scoutId: null }))
            }
          />
        </InputWrapper>
      )}
      {settings.match && (
        <InputWrapper label={`Current Match: ${matchToLabel(settings.match)}`}>
          <NextMatchButton />
          <Button
            label="Change Match"
            onPress={() =>
              setAppSettings((settings) => ({ ...settings, match: null }))
            }
          />
        </InputWrapper>
      )}
      {!settings.match && <GameSelect />}
      {settings.match && settings.scoutId && (
        <StartScoutingButton navigation={navigation} />
      )}
    </>
  );
};

const StartScoutingButton = ({
  navigation,
}: {
  navigation: RootTabScreenProps['navigation'];
}) => {
  const [settings, setAppSettings] = useAtom(appSettingsAtom);
  const [_, setInfo] = useAtom(objectiveInfoAtom);
  const [_type, setType] = useAtom(recordTypeAtom);
  const [_reset, reset] = useAtom(resetAtom);

  if (settings.connection !== 'online') return <></>;

  const match = settings.match;
  const scoutId = settings.scoutId;

  if (!match || !scoutId) return <></>;

  const handleStartScouting = async () => {
    await reset();
    setType('objective');

    const matchNumber =
      settings.match?.comp_level === 'qm'
        ? match.match_number
        : match.set_number;
    setInfo(() => ({
      scoutId: scoutId,
      matchType:
        settings.match?.comp_level === 'qm' ? 'Qualification' : 'Elimination',
      teamNumber: getTeamFromMatch(match, scoutId),
      matchNumber: matchNumber,
    }));

    navigation.navigate('ObjectiveInfo');
  };

  return <Button label="Start Scouting" onPress={handleStartScouting} />;
};

const ScoutIdSelect = () => {
  const [settings, setAppSettings] = useAtom(appSettingsAtom);

  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(
      z.object({ scoutId: objectiveInfoSchema.shape.scoutId })
    ),
  });

  const element = game.elements.find(
    (e) => e.name === 'scoutId' && e.screens.includes('ObjectiveInfo')
  );

  if (settings.connection !== 'online') return <></>;

  const onSubmit = handleSubmit(async (data) => {
    setAppSettings((settings) => ({ ...settings, scoutId: data.scoutId }));
  });

  return (
    <>
      <FieldInput
        control={{ control, name: 'scoutId' as const }}
        error={errors.scoutId as FieldError | undefined}
        field={element!!.field}
        label={element!!.label}
        key={element!!.name}
      />

      <View style={tw`mt-0.5`}>
        <Button label="Set Scout ID" onPress={onSubmit} />
      </View>
    </>
  );
};

type GameSelect = { match: string };

const GameSelect = () => {
  const [settings, setAppSettings] = useAtom(appSettingsAtom);
  const { data: matches, isLoading } = trpc.blueAlliance.findAll.useQuery();

  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<GameSelect>({
    resolver: zodResolver(z.object({ match: z.string() })),
  });

  if (isLoading) return <></>;
  if (!matches) return <></>;

  const getMatch = (key: string) =>
    matches.map((m) => m.content).find((m) => m.key === key);

  const onSubmit = handleSubmit(async (data) => {
    setAppSettings((settings) =>
      settings.connection === 'online'
        ? { ...settings, match: getMatch(data.match) ?? null }
        : settings
    );
  });

  //  {{ match.comp_level === 'qm' ? 'Qualification' : match.comp_level }}
  // {{ match.match_number }} ({{ match.set_number }
  // }) @ ~{{
  // new Date(match.predicted_time).toLocaleTimeString()
  // }}
  //

  return (
    <>
      <Controller
        control={control}
        name={'match'}
        render={({ field: { onChange, value } }) => (
          <InputWrapper label="Match">
            <Picker
              style={tw`w-1/2 rounded mr-0 ml-auto border dark:border-pheonix-red border-griffins-blue dark:text-white`}
              selectedValue={value}
              itemStyle={tw`dark:text-white text-black`}
              onValueChange={onChange}
            >
              {matches
                .map((m) => m.content)
                .sort((a, b) =>
                  // sort practice, then qual tthen playoff,
                  // if same type, then sort by number
                  a.comp_level === b.comp_level
                    ? a.match_number - b.match_number
                    : a.comp_level > b.comp_level
                    ? 1
                    : -1
                )
                .map((e) => (
                  <Picker.Item
                    label={matchToLabel(e)}
                    value={e.key}
                    key={e.key}
                  />
                ))}
            </Picker>
          </InputWrapper>
        )}
      />
      <View style={tw`mt-0.5`}>
        <Button label="Next" onPress={onSubmit} />
      </View>
    </>
  );
};

const NextMatchButton = () => {
  const [settings, setAppSettings] = useAtom(appSettingsAtom);
  const { data: matches, isLoading } = trpc.blueAlliance.findAll.useQuery();

  if (isLoading) return <></>;
  if (!matches) return <></>;

  const handleNextMatch = () => {
    if (settings.connection !== 'online' || !settings.match) return;

    const currentMatch = settings.match;
    const level = currentMatch.comp_level;
    const matchNumber = currentMatch.match_number;

    const nextMatch = matches
      .map((m) => m.content)
      .filter(
        (m) => m.comp_level === level && m.match_number === matchNumber + 1
      )[0];

    if (!nextMatch) return;

    setAppSettings((settings) => ({ ...settings, match: nextMatch }));
  };

  return <Button label="Next Match" onPress={handleNextMatch} />;
};

function matchToLabel(match: any) {
  return `${
    match.comp_level === 'qm'
      ? 'Qualification'
      : match.comp_level === 'f'
      ? 'Final'
      : 'Elim'
  } ${match.match_number} (${match.set_number})`;
}
