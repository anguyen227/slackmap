import { render, waitFor } from '@testing-library/react'
import AppContainer from './AppContainer'

// next/head do not render headers immedialy. They collect all tags via context and render on App complete.
// have to mock next/head to render on test
jest.mock('next/head', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: Array<React.ReactElement> }) => {
            return <>{children}</>
        },
    }
})

describe('AppContainer', () => {
    it('should render title', async () => {
        const title = 'Slack map'
        render(<AppContainer title={title} />)
        await waitFor(() => {
            expect(document.title).toMatch(title)
        })
    })
})
