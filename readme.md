# @pumych/filtering-sorting-service [![install size](https://packagephobia.now.sh/badge?p=@pumych/filtering-sorting-service)](https://packagephobia.now.sh/result?p=@pumych/filtering-sorting-service)
Just a summary of how to create or update NPM package

## Install
```
$ npm install --save @pumych/filtering-sorting-service
```
## Usage
'filterObjectName' - used as react component state object name, and as a name that should be passed to init function, localStorage object will be created with the same name

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
