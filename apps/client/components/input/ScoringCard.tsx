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
import { game, Screen } from '~/models';
import { RootStackParamList, RootTabScreenProps } from '~/types';
import { FieldInput } from './FieldInput';

type Props<
  T extends Record<string, any>,
  B extends keyof RootStackParamList
> = {
  atom: WritableAtom<T, T>;
  navigation: RootTabScreenProps;
  nextPage: B;
  currentPage: B;
  screen: Screen;
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
  type,
}: Omit<Props<T, B>, 'currentPage'>) => {
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
      ...([nextPage] as [keyof RootStackParamList])
    );
  });

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
            field={getElement(e, screen)!!.field}
            label={getElement(e, screen)!!.label}
            key={getElement(e, screen)!!.name}
          />
        ))}
        <Button label="Next" onPress={onSubmit} />
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
  type,
  screen,
}: Omit<Props<T, B>, 'navigation'>) =>
  [
    (navigation: RootTabScreenProps) => (
      <InputModal
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
