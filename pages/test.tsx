import axios from 'api/axios'

const LoginPage = () => {
    const onClick = () => {
        axios().request({
            url: '/user/setUp',
            method: 'POST',
            data: {
                check: 'this out',
            },
        })
    }

    return <button onClick={onClick}>Send Request</button>
}

export default LoginPage

export const getStaticProps = async () => {
    return {
        props: {
            publicPage: true,
        },
    }
}
