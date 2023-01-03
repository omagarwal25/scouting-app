import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, WritableAtom } from 'jotai';
import { DeepPartial, FieldError, Path, useForm } from 'react-hook-form';
import { ZodSchema } from 'zod';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import {
  ObjectiveTopbar,
  PitTobar,
  SubjectiveTopbar,
} from '~/components/Topbar';
import { game, ScoutingElement } from '~/models';
import { RootStackParamList, RootTabScreenProps } from '~/types';
import { FieldInput } from './FieldInput';

type Props<
  T extends Record<string, any>,
  B extends keyof RootStackParamList
> = {
  atom: WritableAtom<T, T>;
  navigation: RootTabScreenProps;
  nextPage: B;
  readonly keys: readonly Path<T>[];
  zodSchema: ZodSchema;
  type:
    | {
        name: 'objective' | 'pit';
      }
    | {
        name: 'subjective';
        team: 'one' | 'two' | 'three' | 'none';
      };
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
  type,
}: Props<T, B>) => {
  const [state, setState] = useAtom(atom);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(zodSchema),
    defaultValues: state as DeepPartial<T>,
  });

  const onSubmit = handleSubmit((f) => {
    setState(f as T);
    navigation.navigation.navigate(
      ...([nextPage] as [screen: keyof RootStackParamList])
    );
  });

  const elements = new Map<string, ScoutingElement>();

  // game.objectiveElements.forEach((element) => {
  //   objectiveElements.set(element.name, element);
  // });

  if (type.name === 'objective') {
    game.objectiveElements.forEach((element) => {
      elements.set(element.name, element);
    });
  } else if (type.name === 'subjective') {
    game.subjectiveElements.forEach((element) => {
      elements.set(element.name, element);
    });
  } else {
    game.pitElements.forEach((element) => {
      elements.set(element.name, element);
    });
  }

  // console.log(elements.get('scoutName'));
  console.log(keys);

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
        {keys.map((e) => (
          <FieldInput
            control={{ control, name: e }}
            error={
              (errors as Record<keyof T, FieldError>)[e as unknown as keyof T]
            }
            field={elements.get(e)!!.field}
            label={elements.get(e)!!.label}
            key={elements.get(e)!!.name}
          />
        ))}
        <Button label="Next" onPress={onSubmit} />
      </Container>
    </>
  );
};

export const scoringCardFactory =
  <T extends object, B extends keyof RootStackParamList>({
    atom,
    keys,
    nextPage,
    zodSchema,
    type,
  }: Omit<Props<T, B>, 'navigation'>) =>
  (navigation: RootTabScreenProps) =>
    (
      <InputModal
        atom={atom}
        navigation={navigation}
        keys={keys}
        nextPage={nextPage}
        zodSchema={zodSchema}
        type={type}
      />
    );
