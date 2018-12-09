/* eslint-disable */

// http://localhost:9000/ui/incidents?caid=344377&status=20&freeText=quick%20search&severity=[minor,major]&dates=all

let filtersObjectName = 'Filter';

/**
 * Init filtering service:
 *
 * 1. Get filters from url, use state[filterName] keys, to get values by
 * 2+3. Merge values from url to localStorage object
 * 4. Get localStorage object and update state[filterName]
 * 5. Update the URL
 *
 * @param _that - where React component state exists
 * @param filterName - will be used in localStorage and in react component state
 * @param updateUrl - [boolean] - update URL from localStorage
 * @param call - callback when init finished
 */
function init( _that, filterName, updateUrlFlag, call ){
    filtersObjectName = filterName;
    // 1. Get filters from url, use state[filterName] keys, to get values by
    // Filter object from URL
    let filterUrlObject = parseUrlSearchToObj( window.location.search );

    // Filter object from state
    let stateFilterObj = _that.state[ filtersObjectName ];
    let filtersKeysNames = Object.keys( stateFilterObj );
    let filterObj = {};

    // 2. Assign values from URL keys to filterObj, only keys from state[filterName] will be assigned
    for( let i = 0; i < filtersKeysNames.length; i++ ){
        let filterKey = filtersKeysNames[i];
        if( !!filterUrlObject[ filterKey ] ){

            // If passed value should be array but it is not an array
            if( Array.isArray(stateFilterObj[ filterKey ]) && !Array.isArray(filterUrlObject[ filterKey ])) {
                filterUrlObject[ filterKey ] = [filterUrlObject[ filterKey ]]
            }
            filterObj[ filterKey ] = filterUrlObject[ filterKey ];
        }
    }

    // 3. Assign filter to localStorage
    setLocalstorageFilter( filterName, filterObj );

    // 4. Get localStorage
    let localStorageFilterObj = getLocalstorageFilter( filtersObjectName );

    // 4b. Update state[filterName]
    _that.setState( (state) => ({
        [ filterName ]: {...state[ filterName ], ...localStorageFilterObj }
    }),() => {
        // 5. Update the URL
        if( !!updateUrlFlag ) {
            updateUrl( _that.state[ filterName ]);
        }
        if ( typeof call() === 'function') call();
    });
}

/**
 * Updates localStorage 'object' and URL according to current state
 * @param filterName
 * @param state
 */
function update( filterName, stateFilterObj ){
    setLocalstorageFilter( filterName, stateFilterObj );
    updateUrl( stateFilterObj );
}

/**
 * Merges filterObj to localStorage "object", if localStorage does't exists, creates it
 *
 * @param filterName
 * @param filterObj
 */
function setLocalstorageFilter( filterName, filterObj ){
    let currentFilterObj = getLocalstorageFilter( filterName );
    let mergedFilter = Object.assign( currentFilterObj, filterObj );
    localStorage.setItem( `${filterName}` , JSON.stringify(mergedFilter) )
}

/**
 * Returns localStorage filter object by filterName
 *
 * @param filterName - localStorage key name
 */
function getLocalstorageFilter( filterName ){
    let filter = localStorage.getItem( `${filterName}` );
    return filter === null ? {} : JSON.parse(filter);
}

/**
 * Parsing object to search url
 *
 * following object: { status: 20, freeText: '', sevrity: ['minor'], dates: 'all' };
 * will be converted to: '&status=20&freeText=&sevrity[]=minor&dates=all'
 *
 * @param obj
 * @returns {string}
 */
function parseSearchObjToUrl( obj ){
    if( typeof obj === 'undefined' || obj === null || obj === '' ) return '';
    let objKeys = Object.keys( obj );
    let urlSearchStr = '';

    for( let i = 0; i < objKeys.length; i++ ) {
        let key = objKeys[i];
        let value = obj[ key ];

        if( Array.isArray( value ) ) {
            // value.forEach( arrayValue => { urlSearchStr += '&' + key + '[]' +'=' + encodeURIComponent( arrayValue );  } );
            urlSearchStr += '&' + key + '=[' + value.map( i => encodeURIComponent(i) ).join(',') + ']';
        } else {
            urlSearchStr += '&' + key + '=' + encodeURIComponent( value );
        }
    }

    return urlSearchStr;
}

/**
 * Parsing window.location.search to JS object
 *
 * following string: '&status=20&freeText=&sevrity=[minor]&dates=all'
 * will be converted to: { status: 20, freeText: '', severity: ['minor'], dates: 'all' };
 *
 * @param urlSearchString
 */
function parseUrlSearchToObj( urlSearchString ){
    if( typeof urlSearchString === 'undefined' || urlSearchString === null || urlSearchString === '' ) return {};
    let keyValueStr = urlSearchString.replace(/^\?/,'').split('&').filter(i => i !== '');
    let returnObj = {};

    for(let i=0; i < keyValueStr.length; i++){
        let keyValArr = keyValueStr[i].split('=');

        // if array detected
        if( keyValArr[1].match(/\[.*?\]/g) ) {
            let keyWithoutBrackets = keyValArr[1].replace('[', '').replace(']', '').split(',');
            returnObj[ keyValArr[0] ] = keyWithoutBrackets;

        } else {
            // Check if string is numerable, we want to save numbers without quotes
            returnObj[ keyValArr[0] ] = !isNaN( keyValArr[1] ) && keyValArr[1].length > 0 ? parseInt( keyValArr[1] ) : decodeURIComponent( keyValArr[1] );
        }
    }

    return returnObj;
}

/**
 * Updates current url without redirect
 *
 * 1. Get filter object from localStorage
 * 2. Get urlFilterObject
 * 3. Merge localStorageObj and urlObj, convert to url and history.replaceState
 *
 * @param state - react component state to get filter object from
 * @param filterName - filter object name in react state
 */
function updateUrl( stateFilterObject ){
    let urlFilterObject = parseUrlSearchToObj( location.search );
    let finalUrlObj = { ...urlFilterObject, ...stateFilterObject };
    let urlSearchObj = parseSearchObjToUrl( finalUrlObj );
    let _location = JSON.parse(JSON.stringify(location));
    history.replaceState(null, '', _location.pathname + urlSearchObj.replace('&', '?'));
}

/**
 * Parsing window.location.search to JS object - using not encoded simplified URL (only values are encoded, not whole URL)
 *
 * example:
 * following string: '&status=20&freeText=&sevrity%5B%5D=minor&dates=all'
 * following string: '&status=20&freeText=&sevrity%5B%5D=minor&dates=all'
 * will be converted to: { status: 20, freeText: '', sevrity: ['minor'], dates: 'all' };
 *
 * @param urlSearchString
 */
function parseUrlSearchToObjSimplified( urlSearchString ){
    if( typeof urlSearchString === 'undefined' || urlSearchString === null || urlSearchString === '' ) return {};
    let keyValueStr = urlSearchString.replace(/^\?/,'').split('&').filter(i => i !== '').map( i => decodeURIComponent(i) );
    let returnObj = {};

    for(let i=0; i < keyValueStr.length; i++){
        let keyValArr = keyValueStr[i].split('=');

        if( keyValArr[0].indexOf('[]') !== -1 ) {
            let keyWithoutBrackets = keyValArr[0].replace('[]', '');
            if( typeof returnObj[ keyWithoutBrackets ] === 'undefined' ){
                returnObj[ keyWithoutBrackets ] = [];
            }

            returnObj[ keyWithoutBrackets ].push( keyValArr[1] );

        } else {
            // Check if string is numerable, we want to save numbers without quotes
            returnObj[keyValArr[0]] = !isNaN( keyValArr[1] ) && keyValArr[1].length > 0 ? parseInt( keyValArr[1] ) : keyValArr[1];
        }
    }

    return returnObj;
}

export { init, update, setLocalstorageFilter, getLocalstorageFilter, parseUrlSearchToObj, parseSearchObjToUrl, updateUrl };
