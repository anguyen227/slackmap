import { Marker, MapContext, MarkerProps } from 'react-map-gl'
import React, { memo, useContext, useMemo } from 'react'
import { Member } from 'models/Member'

type PinProps<D = Member> = Partial<MarkerProps> & {
    data: D
    height?: number
    color?: string
    noScale?: boolean
    onClick?(data: D): void
}
const Pin = ({ data, height = 30, color = '#d00', onClick, noScale, ...markerProps }: PinProps) => {
    // handle dropdown
    // const [open, setOpen] = useState(false)
    // const anchorRef = useRef<SVGSVGElement>(null)
    // const handleToggle = () => {
    //     setOpen((prevOpen) => !prevOpen)
    // }
    // const handleClose = (event: any) => {
    //     if (anchorRef.current?.contains?.(event.target as Node)) {
    //         return
    //     }

    //     setOpen(false)
    // }
    // const handleListKeyDown = (event: React.KeyboardEvent) => {
    //     if (event.key === 'Tab') {
    //         event.preventDefault()
    //         setOpen(false)
    //     } else if (event.key === 'Escape') {
    //         setOpen(false)
    //     }
    // }

    // set marker scale
    const context = useContext(MapContext)
    const scale = useMemo(() => {
        if (noScale) return 1
        const zoom = context.viewport?.zoom ?? 0
        if (zoom < 4) return 1
        return zoom / 4
    }, [context.viewport?.zoom, noScale])

    const offsetTop = height
    // const offsetLeft = (384 * height) / 512 / 2
    const offsetLeft = (54 * height) / 80 / 2

    return (
        <Marker
            {...markerProps}
            offsetTop={-offsetTop}
            offsetLeft={-offsetLeft}
            longitude={data.lng as number}
            latitude={data.lat as number}>
            {/* <svg
                xmlns='http://www.w3.org/2000/svg'
                height={height}
                viewBox='0 0 384 512'
                style={{
                    cursor: 'pointer',
                    fill: color,
                    // transformOrigin: 'bottom',
                    // transform: `scale(${scale})`,
                }}>
                <path d='M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z' />
            </svg> */}
            <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                version='1.1'
                height={height}
                viewBox='0 0 54 80'
                xmlSpace='preserve'
                style={{
                    cursor: 'pointer',
                    fill: color,
                    transformOrigin: 'bottom',
                    transform: `scale(${scale})`,
                }}
                onClick={() => {
                    onClick?.(data)
                }}>
                <defs>
                    <clipPath id='circleView'>
                        <circle cx='27' cy='27' r='24' />
                    </clipPath>
                </defs>
                <g id='veh_bgpDFIVMrUQBZN0P0'>
                    <g id='color_x5F_2'>
                        <path
                            style={{
                                stroke: 'none',
                                strokeWidth: 1,
                                strokeDasharray: 'none',
                                strokeLinecap: 'butt',
                                strokeDashoffset: 0,
                                strokeLinejoin: 'miter',
                                strokeMiterlimit: 4,
                                fillRule: 'nonzero',
                                opacity: 1,
                            }}
                            vectorEffect='non-scaling-stroke'
                            transform='translate(-13, 0)'
                            d='M 40 0 C 25.2 0 13.2 12 13.2 26.8 C 13.2 40 34.4 72.4 39.099999999999994 79.5 C 39.49999999999999 80.2 40.49999999999999 80.2 40.89999999999999 79.5 C 45.599999999999994 72.4 66.79999999999998 40 66.79999999999998 26.799999999999997 C 66.8 12 54.8 0 40 0 z'
                            strokeLinecap='round'
                        />
                    </g>
                    <image
                        xlinkHref={data.avatar_url}
                        preserveAspectRatio='xMidYMid slice'
                        x='0'
                        y='0'
                        width='54'
                        height='54'
                        clipPath='url(#circleView)'
                    />
                </g>
            </svg>
        </Marker>
        // <Popper
        //     open={open}
        //     anchorEl={anchorRef.current}
        //     role={undefined}
        //     placement='bottom-start'
        //     transition
        //     className={css({
        //         zIndex: 1,
        //     })}
        //     disablePortal>
        //     {({ TransitionProps, placement }) => (
        //         <Grow
        //             {...TransitionProps}
        //             style={{
        //                 transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
        //             }}>
        //             <Paper>
        //                 <ClickAwayListener onClickAway={handleClose}>
        //                     <MenuList
        //                         autoFocusItem={open}
        //                         id='composition-menu'
        //                         aria-labelledby='composition-button'
        //                         onKeyDown={handleListKeyDown}>
        //                         <MenuItem>
        //                             <ListItemAvatar>
        //                                 <Avatar alt='_name' src='https://mui.com/static/images/avatar/2.jpg' />
        //                             </ListItemAvatar>
        //                             <ListItemText primary='_name' secondary={'_title'} />
        //                         </MenuItem>
        //                     </MenuList>
        //                 </ClickAwayListener>
        //             </Paper>
        //         </Grow>
        //     )}
        // </Popper>
    )
}

export default memo(Pin)
