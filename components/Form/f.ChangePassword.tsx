import { Button, Stack } from '@mui/material'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'
import * as Yup from 'yup'

import Form from 'components/Form'
import Input from 'components/Form/Input'
import TextInput, { TextInputP } from 'components/Input/TextInput'

import FirebaseApp from 'FirebaseApp'

import parseError from 'utils/parseError'
import delay from 'utils/delay'

type ChangePasswordP = {
    onComplete?(): void
}
const ChangePassword = ({ onComplete }: ChangePasswordP) => {
    return (
        <Form
            initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }}
            validateOnMount={false}
            validationSchema={Yup.object().shape({
                currentPassword: Yup.string().required('Required'),
                newPassword: Yup.string()
                    .required('Required')
                    .min(8, 'Password is too short, min 8 characters')
                    .notOneOf(
                        [Yup.ref('currentPassword'), null],
                        `New password must not be the same as current password`
                    ),
                confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
            })}
            onSubmit={async (values, helpers) => {
                await delay(1000)
                const user = FirebaseApp.auth.currentUser
                if (!user) return
                try {
                    const credential = EmailAuthProvider.credential(user.email as string, values.currentPassword)

                    await reauthenticateWithCredential(user, credential)
                    await updatePassword(user, values.newPassword)
                    onComplete?.()
                    return true
                } catch (e) {
                    const error = parseError(e)
                    if (error.code === 'auth/wrong-password') {
                        helpers.setErrors({
                            currentPassword: 'Your password is incorrect',
                        })
                    }
                    return Promise.reject(e)
                }
            }}>
            <Input<TextInputP>
                autoComplete='current-password'
                fullWidth
                id='current-password'
                label='Current Password'
                margin='normal'
                name='currentPassword'
                required
                type='password'
                component={TextInput}
            />
            <Input<TextInputP>
                fullWidth
                id='new-password'
                label='New Password'
                margin='normal'
                name='newPassword'
                required
                type='password'
                component={TextInput}
            />
            <Input<TextInputP>
                fullWidth
                id='confirm-password'
                label='Confirm Password'
                margin='normal'
                name='confirmPassword'
                required
                type='password'
                component={TextInput}
            />

            <Stack direction='row' spacing={2} sx={{ mt: 3, mb: 2 }}>
                <Button
                    type='button'
                    fullWidth
                    variant='outlined'
                    onClick={() => {
                        onComplete?.()
                    }}>
                    I changed
                </Button>
                <Button type='submit' fullWidth variant='contained'>
                    Change
                </Button>
            </Stack>
        </Form>
    )
}

export default ChangePassword
