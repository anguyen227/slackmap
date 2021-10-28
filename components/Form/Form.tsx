import { Form as FM, Formik, FormikConfig } from 'formik'
import { CircularProgress } from '@mui/material'

import LoadingScreen from 'components/Loading/LoadingScreen'

type FormP<V = any> = {
    formProps?: typeof FM
    noLoadingLayout?: boolean
} & FormikConfig<V>

function Form<V = any>({ children, formProps, noLoadingLayout, ...formik }: FormP<V>) {
    return (
        <Formik {...formik}>
            {(config) => {
                return (
                    <FM
                        {...formProps}
                        style={{
                            position: 'relative',
                        }}>
                        {typeof children === 'function' ? children(config) : children}
                        {!noLoadingLayout && (
                            <LoadingScreen mode='absolute' loading={config.isSubmitting}>
                                <CircularProgress />
                            </LoadingScreen>
                        )}
                    </FM>
                )
            }}
        </Formik>
    )
}

export default Form
