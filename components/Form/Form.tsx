import { Form as FM, Formik, FormikConfig } from 'formik'

type FormP<V = any> = {
    formProps?: typeof FM
} & FormikConfig<V>

function Form<V = any>({ children, formProps, ...formik }: FormP<V>) {
    return (
        <Formik {...formik}>
            {(config) => <FM {...formProps}>{typeof children === 'function' ? children(config) : children}</FM>}
        </Formik>
    )
}

export default Form
