import { zodResolver } from '@hookform/resolvers/zod';
import { SetStateAction, useAtom, WritableAtom } from 'jotai';
import { Fragment, useEffect } from 'react';
import { DeepPartial, FieldError, Path, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { ZodObject, ZodSchema } from 'zod';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import {
  ObjectiveTopbar,
  PitTobar,
  SubjectiveTopbar,
} from '~/components/Topbar';
import { game, ScoutingElement, Screen } from '~/models';
import { RootStackParamList, RootTabScreenProps } from '~/types';
import tw from '~/utils/tailwind';
import { FieldInput } from './FieldInput';

type Props<
  T extends Record<string, any>,
  B extends keyof RootStackParamList
> = {
  atom: WritableAtom<T, SetStateAction<T>>;
  navigation: RootTabScreenProps;
  nextPage: B;
  currentPage: B;
  screen: Screen;
  readonly keys: readonly Path<T>[];
  zodSchema: ZodSchema;
  defaults: ZodObject<any>;
  type:
    | {
        name: 'objective' | 'pit';
      }
    | {
        name: 'subjective';
        team: 'one' | 'two' | 'three' | 'none';
      };
};

const getElement = (name: string, screen: Screen) => {
  return game.elements.find(
    (e) => e.name === name && e.screens.includes(screen)
  );
};

export const InputModal = <
  T extends object,
  B extends keyof RootStackParamList
>({
  atom,
  navigation,
  keys,
  nextPage,
  zodSchema,
  screen,
  defaults,
  type,
}: Omit<Props<T, B>, 'currentPage'>) => {
  const [state, setState] = useAtom(atom);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    formState,
    formState: { isValidating },
    setValue,
    getValues,
  } = useForm<T>({
    resolver: zodResolver(zodSchema),
    defaultValues: state as DeepPartial<T>,
  });

  const addGrouping = (name: keyof T) => {
    const values = getValues();

    if (values[name] === undefined) {
      const blank = defaults.shape[name].removeDefault().element.parse({});

      setValue(name as unknown as Path<T>, [blank] as any);
      return;
    }

    setValue(
      `${name as string}.${
        (values[name] as any[]).length
      }` as unknown as Path<T>,

      defaults.shape[name].removeDefault().element.parse({})
    );
  };

  const removeGrouping = (name: keyof T, index: number) => {
    const values = getValues();

    if (values[name] === undefined) {
      return;
    }

    const newValues = (values[name] as any[]).filter((_, i) => i !== index);

    setValue(name as unknown as Path<T>, newValues as any);
  };

  const onSubmit = handleSubmit(
    (f) => {
      console.log('hello its me');
      setState(f as T);
    },
    (f) => console.log(f)
  );

  const onSubmitAndNavigate = () => {
    onSubmit();

    navigation.navigation.navigate(
      ...([nextPage] as [keyof RootStackParamList])
    );
  };

  const data = watch();

  const groupings = keys
    .map((e) => getElement(e, screen))
    .filter((e) => e?.field.fieldType === 'Grouping')
    .filter((e) => e !== undefined)
    .map(
      (e) => [e as ScoutingElement, (data as any)[e!.name] as any[]] as const
    );

  useEffect(() => {
    if (formState.isValid && !isValidating) {
      onSubmit();
    }
  }, [data, isValidating, formState, onSubmit]);

  return (
    <>
      {type.name === 'subjective' ? (
        <SubjectiveTopbar team={type.team} />
      ) : type.name === 'objective' ? (
        <ObjectiveTopbar />
      ) : (
        <PitTobar />
      )}
      <Container>
        {keys
          .filter((e) => getElement(e, screen)?.field.fieldType !== 'Grouping')
          .map((e) => (
            <FieldInput
              control={{ control, name: e }}
              error={
                (errors as Record<keyof T, FieldError>)[e as unknown as keyof T]
              }
              field={getElement(e, screen)!!.field}
              label={getElement(e, screen)!!.label}
              key={getElement(e, screen)!!.name}
            />
          ))}

        {groupings.map(([e, data]) => (
          <Fragment key={e.name}>
            <Text style={tw`dark:text-white mt-2`}>{e.label}</Text>
            {data.length > 0 ? (
              data.map((_, i) => (
                <Fragment key={i}>
                  <Text style={tw`dark:text-white`}>Group {i}</Text>
                  {e.field.fieldType === 'Grouping' &&
                    e.field.fields.map((f) => (
                      <FieldInput
                        control={{
                          control,
                          name: `${e.name}.${i}.${f.name}` as any,
                        }}
                        error={
                          (errors as Record<keyof T, FieldError>)[
                            `${e.name}.${i}.${f.name}` as unknown as keyof T
                          ]
                        }
                        field={f.field}
                        label={f.label}
                        key={f.name}
                      />
                    ))}
                  <Button
                    label="Delete"
                    onPress={() => removeGrouping(e.name as keyof T, i)}
                  />
                </Fragment>
              ))
            ) : (
              <Text style={tw`dark:text-white`}>None</Text>
            )}
          </Fragment>
        ))}

        {groupings.map(([e, _]) => (
          <View style={tw`mt-0.5`}>
            <Button
              key={e.name}
              label={`Add ${e.label}`}
              onPress={() => addGrouping(e.name as keyof T)}
            />
          </View>
        ))}
        <Text style={tw`mt-0.5`}>
          <Button label="Next" onPress={onSubmitAndNavigate} />
        </Text>
      </Container>
    </>
  );
};

export const scoringCardFactory = <
  T extends object,
  B extends keyof RootStackParamList
>({
  atom,
  keys,
  nextPage,
  zodSchema,
  currentPage,
  defaults,
  type,
  screen,
}: Omit<Props<T, B>, 'navigation'>) =>
  [
    (navigation: RootTabScreenProps) => (
      <InputModal
        defaults={defaults}
        atom={atom}
        navigation={navigation}
        keys={keys}
        screen={screen}
        nextPage={nextPage}
        zodSchema={zodSchema}
        type={type}
      />
    ),
    currentPage,
  ] as const;
