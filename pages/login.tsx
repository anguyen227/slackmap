import { browserLocalPersistence, browserSessionPersistence } from 'firebase/auth'
import { Button, Checkbox, FormControlLabel, Typography, Container } from '@mui/material'
import { getCookie } from 'cookies-next'
import { GetStaticProps } from 'next'
import { useState } from 'react'
import * as Yup from 'yup'

import Cookie from 'enum/Cookie'
import useAuth from 'services/auth/useAuth'

import AppContainer from 'components/AppContainer'
import Form from 'components/Form'
import Input from 'components/Form/Input'
import TextInput, { TextInputP } from 'components/Input/TextInput'
import parseError from 'utils/parseError'

const LoginPage = () => {
    const { login, changePersistence } = useAuth()
    const [rememberMe, setRememberMe] = useState(browserLocalPersistence.type === getCookie(Cookie.AuthPersistence))

    return (
        <AppContainer title='Sign in to Slack Map'>
            <Container
                component='main'
                maxWidth='sm'
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    pt: 8,
                    px: 1,
                }}>
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Form
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    noLoadingLayout
                    validateOnMount={false}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email('Invalid email').required('Required'),
                        password: Yup.string()
                            .required('Required')
                            // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-`~!#$%^&*()_=+\[\]{}\\|;:'",.<>\/?])/,
                            // .matches(/[a-z]+/, 'At least one lowercase character')
                            // .matches(/[A-Z]+/, 'At least one uppercase character')
                            // .matches(/[0-9]+/, 'At least one numberic character')
                            // .matches(/[-!@~#$%^&*_+=`|\\\/(){}\[\]:;"'<>,.?]+/, 'At least one special character')
                            .min(8, 'Password is too short, min 8 characters'),
                    })}
                    onSubmit={async (values, helpers) => {
                        try {
                            const res = await login?.(values.email, values.password)
                            // if (!res.user.emailVerified) {
                            //     router.push({
                            //         pathname: '/set-up-account',
                            //     })
                            // }
                        } catch (e) {
                            const error = parseError(e)
                            if (error.code === 'auth/wrong-password') {
                                helpers.setErrors({
                                    password: 'Password is incorrect',
                                })
                            }
                        }
                    }}>
                    <Input<TextInputP>
                        autoComplete='email'
                        autoFocus
                        fullWidth
                        id='email'
                        label='Email Address'
                        margin='normal'
                        name='email'
                        required
                        component={TextInput}
                    />
                    <Input<TextInputP>
                        autoComplete='current-password'
                        fullWidth
                        id='password'
                        label='Password'
                        margin='normal'
                        name='password'
                        required
                        type='password'
                        component={TextInput}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                color='primary'
                                onChange={(_, checked) => {
                                    changePersistence(
                                        checked ? browserLocalPersistence : browserSessionPersistence
                                    ).then((_res) => {
                                        setRememberMe(checked)
                                    })
                                }}
                            />
                        }
                        label='Remember me'
                    />
                    <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                </Form>
            </Container>
        </AppContainer>
    )
}

export default LoginPage

export const getStaticProps: GetStaticProps = async (_context) => {
    return {
        props: {
            unProtectPage: true,
        },
    }
}
