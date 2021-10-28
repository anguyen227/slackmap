import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

type FaIcon = Omit<FontAwesomeIconProps, 'icon'>

export function FaLocationArrow(props: FaIcon) {
    return <FontAwesomeIcon {...props} icon={faLocationArrow} />
}
