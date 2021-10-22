import { browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { css } from '@emotion/css'
import { getCookie } from 'cookies-next'
import * as Yup from 'yup'
import React, { useState } from 'react'

import Firebase from 'FirebaseApp'
import AppContainer from 'components/AppContainer'
import Form from 'components/Form'

import Cookie from 'enum/Cookie'
import handleAuthPersistence from 'services/auth/handleAuthPersistence'
import useAuth from 'services/auth/useAuth'

import TextInput, { TextInputP } from 'components/Input/TextInput'
import Input from 'components/Form/Input'

const LoginPage = () => {
    const { login, isAuthenticated, currentUser, isLoading, changePersistence } = useAuth()
    const [rememberMe, setRememberMe] = useState(browserLocalPersistence.type === getCookie(Cookie.AuthPersistence))
    
    return (
        <AppContainer title='Sign in to Slack Map'>
            <div
                className={css({
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '8rem 1rem 0',
                })}>
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Form
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validateOnMount={false}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email('Invalid email').required('Required'),
                        password: Yup.string()
                            .required('Required')
                            // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-`~!#$%^&*()_=+\[\]{}\\|;:'",.<>\/?])/,
                            .matches(/[a-z]+/, 'At least one lowercase character')
                            // .matches(/[A-Z]+/, 'At least one uppercase character')
                            // .matches(/[0-9]+/, 'At least one numberic character')
                            // .matches(/[-!@~#$%^&*_+=`|\\\/(){}\[\]:;"'<>,.?]+/, 'At least one special character')
                            .min(8, 'Password is too short, min 8 characters'),
                    })}
                    onSubmit={async (values, helpers) => {
                        await login?.(values.email, values.password)
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
            </div>
        </AppContainer>
    )
}

export default LoginPage
