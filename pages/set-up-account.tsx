import { Container, Link, Step, StepLabel, Stepper, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import React, { useState } from 'react'

import ChangePassword from 'components/Form/f.ChangePassword'
import AppContainer from 'components/AppContainer'

const steps = ['Change password', 'Set up location']

const Map = dynamic(() => import('components/Map/MapDropMarker'), {
    loading: () => null,
    ssr: false,
})

function getStepContent(step: number, handleStep: (index: number) => void) {
    switch (step) {
        case 0:
            return (
                <Container maxWidth='sm'>
                    <ChangePassword
                        onComplete={() => {
                            handleStep(1)
                        }}
                    />
                </Container>
            )
        case 1:
            return (
                <Container maxWidth='lg'>
                    <Map
                        onComplete={() => {
                            handleStep(1)
                        }}
                    />
                </Container>
            )
        default:
            throw new Error('Unknown step')
    }
}

const SetUpAccount = () => {
    const [activeStep, setActiveStep] = useState(0)

    const handleStep = (index: number) => {
        setActiveStep((prev) => prev + index)
    }

    return (
        <AppContainer title='Setting up account'>
            <Container
                component='main'
                sx={{
                    py: 6,
                }}>
                <Container
                    maxWidth='sm'
                    sx={{
                        pb: 6,
                    }}>
                    <Typography component='h1' variant='h4' align='center'>
                        Setting up your account
                    </Typography>
                    <Typography
                        variant='subtitle1'
                        align='center'
                        sx={{
                            mt: 3,
                        }}>
                        {`Welcome to Slack Map !!! Before we show you your team, there're few things that need to set up first`}
                    </Typography>
                    <Stepper
                        activeStep={activeStep}
                        sx={{
                            mt: 3,
                        }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Container>
                <>
                    {activeStep === steps.length ? (
                        <Container maxWidth='sm'>
                            <Typography textAlign='center'>
                                {`You're all set!!! Check out your team map `}
                                <NextLink href='/' passHref>
                                    <Link>here</Link>
                                </NextLink>
                            </Typography>
                        </Container>
                    ) : (
                        <>{getStepContent(activeStep, handleStep)}</>
                    )}
                </>
            </Container>
        </AppContainer>
    )
}

export default SetUpAccount

export const getStaticProps = async () => {
    return {
        props: {
            protectPage: true,
        },
    }
}
