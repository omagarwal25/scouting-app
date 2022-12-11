import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, WritableAtom } from 'jotai';
import { DeepPartial, FieldError, Path, useForm } from 'react-hook-form';
import { ZodSchema } from 'zod';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Topbar } from '~/components/Topbar';
import { game, ObjectiveElement } from '~/models';
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

  const objectiveElements = new Map<string, ObjectiveElement>();

  game.objectiveElements.forEach((element) => {
    objectiveElements.set(element.name, element);
  });

  return (
    <>
      <Topbar />
      <Container>
        {keys.map((e) => (
          <FieldInput
            control={{ control, name: e }}
            error={
              (errors as Record<keyof T, FieldError>)[e as unknown as keyof T]
            }
            field={objectiveElements.get(e)!!.field}
            label={objectiveElements.get(e)!!.label}
            key={objectiveElements.get(e)!!.hash}
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
  }: Omit<Props<T, B>, 'navigation'>) =>
  (navigation: RootTabScreenProps) =>
    (
      <InputModal
        atom={atom}
        navigation={navigation}
        keys={keys}
        nextPage={nextPage}
        zodSchema={zodSchema}
      />
    );
