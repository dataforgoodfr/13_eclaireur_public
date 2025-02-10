

export default function MapPage() {
    return (
        <div className='global-margin flex h-screen flex-col items-center justify-center'>
      <h1>
      Page carte
      </h1>
      <ul>
        <li>
        - Fetch data from the db - selected communities. 
        </li>
        <li>
        - In the table there is a column ‘type’
        </li>
        <li>
        - Create a filter to allow users to select the type of community and for all of these to be displayed on the map
        </li>
        <li>
        - e.g. user selects region so the map shows the regions
        </li>
        <li>
        - if a user hovers on a region, they can see its population (we will add more data to this functionality with time. e.g. number of subventions, a score for how good their data is etc)
        </li>
        <li>
        - There is lat and long in the selected communities table which can be used.
        </li>
        <li>
        Q: what other types of high level information do we want to display on the map ?
        </li>
        <li>
        - If a user click on a commune they are taken to the page for that community ?
        </li>
        <li>
        - If a user click on a commune that has no data, they are triggered to contact them ?
        </li>
      </ul>
    </div>
    )
}