import Map from './Map'

const MapMembers = () => {
    return <Map></Map>
}

export default MapMembers

// // load and prepare data
// const url = 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
// const { data, error } = useSwr(url, fetcher)

// // get map bounds
// const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null

// // get clusters
// const { clusters, supercluster } = useSupercluster({
//     points: !error && data ? data : [],
//     bounds,
//     zoom: viewport.zoom as number,
//     options: { radius: 60, maxZoom: 12 },
// })

//////////////////////////

// {
//     clusters.map((cluster) => {
//         // every cluster point has coordinates
//         const [longitude, latitude] = cluster.geometry.coordinates
//         // the point may be either a cluster or a crime point
//         const { cluster: isCluster, point_count: pointCount, point_count_abbreviated: pointAbbr } = cluster.properties

//         if (isCluster) {
//             const backgroundColor = palette.filter(([range]) => range <= pointCount)?.[0]?.[1] ?? '#1978c8'
//             return (
//                 <Marker key={`cluster-${cluster.id}`} latitude={latitude} longitude={longitude}>
//                     <div
//                         className={css({
//                             alignItems: 'center',
//                             borderRadius: '50%',
//                             color: '#fff',
//                             cursor: 'pointer',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             lineHeight: 1,
//                         })}
//                         style={{
//                             backgroundColor,
//                             width: 30 + Math.round((pointCount / data.length) * 1000) / 8,
//                             height: 30 + Math.round((pointCount / data.length) * 1000) / 8,
//                         }}
//                         onClick={() => {
//                             const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20)

//                             setViewport((prev) => ({
//                                 ...prev,
//                                 latitude,
//                                 longitude,
//                                 zoom: expansionZoom,
//                                 transitionInterpolator: new FlyToInterpolator({
//                                     speed: 2,
//                                 }),
//                                 transitionDuration: 'auto',
//                             }))
//                         }}>
//                         {pointCount > 999 ? pointAbbr : pointCount}
//                     </div>
//                 </Marker>
//             )
//         }
//         return (
//             <Pin
//                 key={`user-${cluster.properties.id}`}
//                 data={{
//                     ...cluster.properties,
//                     latitude,
//                     longitude,
//                 }}
//             />
//         )
//     })
// }
