import { Field, FastField, FieldConfig, FieldProps } from 'formik'
import { createElement } from 'react'

type InputP<P = any> = Pick<FieldConfig<any>, 'name' | 'validate'> &
    Omit<P, keyof FieldProps> & {
        isolate?: boolean
        /**
         * Field component to render.
         */
        component: React.ComponentType<any>
    }

function Input<P = {}>({ isolate, component, validate, ...props }: InputP<P>) {
    if (!!isolate)
        return (
            <FastField validate={validate} name={props.name}>
                {renderChild}
            </FastField>
        )
    return (
        <Field {...props} validate={validate} name={props.name}>
            {renderChild}
        </Field>
    )

    function renderChild(fProps: FieldProps) {
        if (component) return createElement(component, { ...props, ...fProps })
        return null
    }
}

export default Input
