import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { appSettingsAtom } from '~/state';
import { trpc } from '~/utils/trpc';

export const Online = () => {
  const [settings, setAppSettings] = useAtom(appSettingsAtom);

  const { data: matches, isLoading } = trpc.blueAlliance.findAll.useQuery();

  const { handleSubmit } = useForm({});
};
