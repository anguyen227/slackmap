import { render } from '@testing-library/react'
import Map from './Map'

describe('Map', () => {
    it('should render fine', async () => {
        const map = render(<Map />)
        const container = map.container.querySelector('.mapbox')
        expect(container).not.toBeNull()
        expect(container).not.toBeUndefined()
    })
})
