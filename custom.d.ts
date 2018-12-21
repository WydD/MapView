declare module '*.svg' {
  const content: any
  export default content
  export class ReactComponent extends React.Component<any> {}
}

declare module '*.png'

declare module '@turf/centroid' {
  import { AllGeoJSON, Properties, Feature, Point } from '@turf/helpers'
  function centroid<P = Properties>(geojson: AllGeoJSON, options?: any): Feature<Point, P>
  export = centroid
}

declare module 'turf-polygon' {
  function polygon(coordinates: any, properties?: any): any
  export = polygon
}

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}
