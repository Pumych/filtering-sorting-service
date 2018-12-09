# @pumych/filtering-sorting-service [![install size](https://packagephobia.now.sh/badge?p=@pumych/filtering-sorting-service)](https://packagephobia.now.sh/result?p=@pumych/filtering-sorting-service)
Service saves the state of current filtering value in localStorage, URL and component's state. 

Service flow on Init: 
1. Get filters values from URL search ( window.location.search ), use component state[filterName] keys, to get relevant values
1. Merge URL search values to localStorage object ( only exists keys in state[filterName] will be used )
1. Merge localStorage object to state[filterName] 
1. Merge localStorage to URL search

After updating filters on your page, filteringSortingService.update(...) function should be initialized, this will update the URL search and the localStorage object according to state[filterName] object

## Install
```
$ npm install --save @pumych/filtering-sorting-service
```
## Usage
'filterObjectName' - used as react component state and localStorage object name, where filtering data should be saved.

```JSX
import * as filteringSortingService from '@pumych/filtering-sorting-service';

const filterObjectName = 'myFilter';

class MyClass extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            [filterObjectName]: {
                filterName: 'filterValue'
            }
        }
    }
    
    componentWillMount(){
        filteringSortingService.init( this, filterObjectName, true, () => {
            // Do something after localStorage, URL and state updated
        });
    }
    
    render(){
        return(
            // Your code is here
        );
    }
    
    _onFilterUpdate( filterObjectName ){
    		filteringSortingService.update( filterObjectName, this.state[ filterObjectName ] )
    }
}
```

## TODO
