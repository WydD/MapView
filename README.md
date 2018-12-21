# MapView
Map view component of the Re-search Alps project 

## Technological introduction
This project was bootstrapped with [AccurApp](https://github.com/accurat/accurapp).

[Read the rest of the documentation here.](https://github.com/accurat/accurapp)

Once you installed the dependencies running `yarn`, these are the available commands:

## Usage

- `yarn start` starts a server locally
- `yarn build` builds the project for production, ready to be deployed from the `build/` folder



# Application

The main goal of the application is to give the user an interactive way to explore the [Re-Search Alps](http://researchalps.eu/) dataset, with a precisive focus on a geographical exploration.

For this reason the application offers the user different ways to interact with the map and the data; on the left of the app we have two groups of functionalities:

Navigation and Search
- Search by Structure
- Search by Place
- Save/Restore Research

Selection and Information
- Simple selection
- Polygon selection
- Radius selection

## Navigation and Search

**Search by Structure**

![searchByStructure](/public/searchStructure.png "Search by Structure")

'Search by Structure' enables the user to quickly find and navigate one structure; this functionality is based on an auto-complete module that looks for the closest structure name found in the dataset.
Given the huge amount of data coming from the end-points, a brief status label is set for the user to understand if the query is still loading or it is ineffective.

**Search by Place**

![searchByPlace](/public/searchLocation.png "Search by Place")

'Search by Place' enables the user to quickly navigate to a specific location on the map; this functionality is based on an auto-complete module native to mapbox's APIs.
This enables the user to also search for entities and structures available throught Mapbox's API without selecting a point; is to be kept in mind that the amount of information provided by Mapbox (in relation to the matters at hand) is way more limited that the one available on Re-Search Alps servers.

**Save / Restore Research**

![saveRestoreResearch](/public/saveRestoreConfiguration.png "Save/Restore research")

The Save / Restore Research functionality is designed to give the user a way to save its queries without having to create a persistent database on where to save credentials and queries.
By copying the current configuration to the clipboard the user can easily share the analysis or result s/he has found in a straightforward JSON format.
Whenever the user decides to restore this configuration, a similar JSON can be pasted in the textbox found in the 'Save/Restore Research overlay'; a small informative label will help the user to understand if the pasted text is a valid 'Re-Search Alps configuration'.

**Simple Selection**

![simpleSelection](/public/selectSimple.png "Simple Selection")

The first and default type of selection is the Simple Selection tool; this tool enables the user to select a single structure and inspect its data (the information about the structure is previewed in the blue info box located on the top of the application ).
Once the user has selected a structure s/he can continue to select others and create a multiple selection by pressing the 'M' keyboard letter and selecting the structures with the mouse (this disables the touch devices to have a multiple selection ).


**Polygon Selection**

![polygonSelection](/public/selectPolygon.png "Polygon Selection")

The polygon selection enables the user to create complex shapes and use them as a geographical filter on the map. This functionality can be very useful because it gives the user the freely define the rules of its selection.
There are no amount of points to limit the shape, but it is very important to keep in mind that the more coordinates are passed to the servers, the slower the calculus could be.

The polygon selection empowers the user to 'break' geographical and socio-economical selection and define an area across different regions and countries.

**Radial Selection**

![radiusSelection](/public/selectRadius.png "Radius Selection")

As the Polygon selection tool, the Radial selection empowers the user to filter the data in a specific and focused way; the radial selection is usually used to highlight the structure with a linear-distance filter.


## More Info

Once the user has defined its selection, a hidden panel with detailed information is made available.
By clicking more info in the blue infobox at the top, the user can explore and filter once more the structure based on:
• the amount of children they have
• the amount of linked structures they have (number of structures they have partnered with)
• the amount of project they have
• the amount of publications they've made

The result of the seledtion and of these filters is available in the 'More Info' panel in a throught an interactive list, that enables the user to directly navigate to a structure page.

# API Interaction

The APIs have been designed by Acccurat and SideTrade (earlier Data-Publica) to work for both the 'Exploratory Map' component and the 'Advanced Query' component of the Platform; the implementation has been done by SideTrade.
A swagger and basic API Documentation can be found [here](http://researchalps.data-publica.com/api/swagger-ui.html#/)

There are 4 Endpoints, each used in different fashion:
- **/nomenclatures**
- **/publications**
- **/search**
- **/structure**

Here the type of calls the user and the platform actually use (more details [here](http://researchalps.data-publica.com/api/swagger-ui.html#/).

**/nomenclatures**

Type: GET

**/publications/{id}**

Type: GET

**/project/search**

Type: POST

**/project/{id}**

Type: GET

**/structures/near/{i}**

Type: GET

**/structures/search**

Type: POST

**/structures/export/**

Type: GET

**/structures/search/georesults/**

Type: POST

**/structures/{i}**

Type: GET

**/structures/{i}/keywords**

Type: GET

# Development Notes

## Temporary fix

The marker used in `react-mapbox-gl` has a mistaken Type in `overlay.ts`. In order for the build of the platform to not crash or have errors, the 114 line of `node_modules/react-mapbox-gl/src/util/overlays.ts` has to be edited: `res[anchor] = Point.convert(offset[anchor] as any|| defaultPoint);`.

The required version of `mapbox-gl` is `0.48.0`; `0.50.0` is not supported and shouldn't be used.

Reference Commit: `083e48f` aka [here](https://bitbucket.org/accurat/research-alps/commits/083e48f99ee2)