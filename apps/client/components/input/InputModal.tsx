import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, WritableAtom } from 'jotai';
import {
  DeepPartial,
  FieldError,
  Path,
  UnpackNestedValue,
  useForm,
} from 'react-hook-form';
import { game, ScoringElement } from '../../models';
import { RootStackParamList, RootTabScreenProps } from '../../types';
import { Topbar } from '../Topbar';
import { Button } from '../Button';
import { ScrollView } from '../Themed';
import { FieldInput } from './FieldInput';
import { container } from '../../styles/container';
import { ZodSchema } from 'zod';

type Props<
  T extends Record<string, any>,
  B extends keyof RootStackParamList
> = {
  atom: WritableAtom<T, T>;
  navigation: RootTabScreenProps<'TabOne'>;
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
    defaultValues: state as UnpackNestedValue<DeepPartial<T>>,
  });

  const onSubmit = handleSubmit((f) => {
    setState(f as T);
    navigation.navigation.navigate(
      ...([nextPage] as [screen: keyof RootStackParamList | 'TabOne'])
    );
  });

  const scoringElements = game.scoringElements.reduce<
    Record<string, ScoringElement>
  >((acc, curr) => ({ ...acc, [curr.name]: curr }), {});

  return (
    <>
      <Topbar />
      <ScrollView style={container.container}>
        {keys.map((e) => (
          <FieldInput
            control={{ control, name: e }}
            error={
              (errors as Record<keyof T, FieldError>)[e as unknown as keyof T]
            }
            field={scoringElements[e].field}
            label={scoringElements[e].label}
            key={scoringElements[e].hash}
          />
        ))}
        <Button label="Next" onPress={onSubmit} />
      </ScrollView>
    </>
  );
};
