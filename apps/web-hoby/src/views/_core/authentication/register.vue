<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, h, ref, useTemplateRef } from 'vue';

import { AuthenticationRegister, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Register' });

const authStore = useAuthStore();

const CODE_LENGTH = 6;

const loading = ref(false);
const registerRef =
  useTemplateRef<InstanceType<typeof AuthenticationRegister>>('registerRef');
function sendCodeApi(phoneNumber: string) {
  message.loading({
    content: $t('page.auth.sendingCode'),
    duration: 0,
    key: 'sending-code',
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      message.success({
        content: $t('page.auth.codeSentTo', [phoneNumber]),
        duration: 3,
        key: 'sending-code',
      });
      resolve({ code: '123456', phoneNumber });
    }, 3000);
  });
}

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.companyNameTip'),
      },
      fieldName: 'companyName',
      label: $t('authentication.companyName'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.companyNameTip') }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.phoneTip'),
      },
      fieldName: 'phone',
      label: $t('authentication.phone'),
      rules: z.string().min(1, { message: $t('authentication.phoneTip') }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.nameTip'),
      },
      fieldName: 'name',
      label: $t('authentication.name'),
      rules: z.string().min(1, { message: $t('authentication.nameTip') }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      renderComponentContent() {
        return {
          strengthText: () => $t('authentication.passwordStrength'),
        };
      },
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    // {
    //   component: 'VbenInputPassword',
    //   componentProps: {
    //     placeholder: $t('authentication.confirmPassword'),
    //   },
    //   dependencies: {
    //     rules(values) {
    //       const { password } = values;
    //       return z
    //         .string({ required_error: $t('authentication.passwordTip') })
    //         .min(1, { message: $t('authentication.passwordTip') })
    //         .refine((value) => value === password, {
    //           message: $t('authentication.confirmPasswordTip'),
    //         });
    //     },
    //     triggerFields: ['password'],
    //   },
    //   fieldName: 'confirmPassword',
    //   label: $t('authentication.confirmPassword'),
    // },
    {
      component: 'VbenPinInput',
      componentProps: {
        codeLength: CODE_LENGTH,
        createText: (countdown: number) => {
          const text =
            countdown > 0
              ? $t('authentication.sendText', [countdown])
              : $t('authentication.sendCode');
          return text;
        },
        handleSendCode: async () => {
          // 模拟发送验证码
          // Simulate sending verification code
          loading.value = true;
          const formApi = registerRef.value?.getFormApi();
          if (!formApi) {
            loading.value = false;
            throw new Error('formApi is not ready');
          }
          await formApi.validateField('phone');
          const isPhoneReady = await formApi.isFieldValid('phone');
          if (!isPhoneReady) {
            loading.value = false;
            throw new Error('Phone number is not Ready');
          }
          const { phone } = await formApi.getValues();
          await sendCodeApi(phone);
          loading.value = false;
        },
        placeholder: $t('authentication.code'),
      },
      fieldName: 'code',
      label: $t('authentication.code'),
      // rules: z.string().length(CODE_LENGTH, {
      //   message: $t('authentication.codeTip', [CODE_LENGTH]),
      // }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.creditCodeTip'),
      },
      fieldName: 'creditCode',
      label: $t('authentication.creditCode'),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.addressTip'),
      },
      fieldName: 'address',
      label: $t('authentication.address'),
    },
    {
      component: 'VbenCheckbox',
      fieldName: 'agreePolicy',
      renderComponentContent: () => ({
        default: () =>
          h('span', [
            $t('authentication.agree'),
            h(
              'a',
              {
                class: 'vben-link ml-1 ',
                href: '',
              },
              `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`,
            ),
          ]),
      }),
      rules: z.boolean().refine((value) => !!value, {
        message: $t('authentication.agreeTip'),
      }),
    },
  ];
});

function handleSubmit(value: Recordable<any>) {
  // eslint-disable-next-line no-console
  console.log('register submit:', value);
  authStore.authRegister(value);
}
</script>

<template>
  <AuthenticationRegister
    ref="registerRef"
    :form-schema="formSchema"
    :copyright="false"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
