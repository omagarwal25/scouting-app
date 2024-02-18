import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useAtom } from 'jotai';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';
import { TBAMatch } from '~/../../packages/api/dist/packages/api/src';
import { game, objectiveInfoSchema } from '~/models';
import { appSettingsAtom } from '~/state';
import tw from '~/utils/tailwind';
import { trpc } from '~/utils/trpc';
import { Button } from './Button';
import { FieldInput } from './input/FieldInput';
import { InputWrapper } from './input/InputWrapper';

export const Online = () => {
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
        <Button label="Next" onPress={onSubmit} />
      </View>
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
  // { { match.match_number } } ({{ match.set_number }
  // }) @ ~{{
  // new Date(match.predicted_time).toLocaleTimeString()
  // }}

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

  return (
    <Button label="Next Match" onPress={handleNextMatch} />
  )
};


function matchToLabel(match: any) {
  return `${match.comp_level === 'qm' ? 'Qualification' : match.comp_level} ${match.match_number
    } ${match.set_number}`;
}
