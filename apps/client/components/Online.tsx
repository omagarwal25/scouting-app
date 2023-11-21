import { appSettingsAtom } from '~/state';
import { useAtom } from 'jotai';
import { trpc } from '~/utils/trpc';
import { useState } from 'react';
import { TBAMatch } from '@griffins-scout/api';
import { ObjectiveInfo, SubjectiveInfo } from '~/models';
import { useForm } from 'react-hook-form';

export const Online = () => {
  const [settings, setAppSettings] = useAtom(appSettingsAtom);

  const { data: matches, isLoading } = trpc.match.findAll.useQuery();

  const { handleSubmit } = useForm({

  });
};
