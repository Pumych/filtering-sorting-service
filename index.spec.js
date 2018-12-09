import * as filteringSortingService from './filtering-sorting-service.js';

describe( 'nothing', () => {
    it( 'should do nothing', () => {
        expect( true ).toBeTruthy();
    } );
} );

const objFromSearchUrl = {
    status: 'any',
    freeText: 'quick search',
    severity: ['minor','major'],
    dates: 'all'
};

const objFromSearchUrl_b = {
    status: 'open',
    freeText: '',
    severity: ['minor'],
    dates: 'all'
};

describe( 'parseUrlSearchToObj', () => {

    it( 'should parse the string', () => {
        expect( filteringSortingService.parseUrlSearchToObj( '&status=any&freeText=quick%20search&severity=[minor,major]&dates=all' ) ).toEqual( objFromSearchUrl );
    });

    // it( 'should parse the string', () => {
    //     expect( filteringSortingService.parseUrlSearchToObj( '&status=wrong&freeText=quick%20search&severity=[minor,major]&dates=all' ) ).toEqual( objFromSearchUrl );
    // });

    it( 'should parse the string', () => {
        expect( filteringSortingService.parseUrlSearchToObj( '&status=open&freeText=&severity=[minor]&dates=all' ) ).toEqual( objFromSearchUrl_b );
    });

    it( 'should return empty object ( empty string passed )', () => {
        expect( filteringSortingService.parseUrlSearchToObj('') ).toEqual( {} );
    });

    it( 'should return empty object ( null passed )', () => {
        expect( filteringSortingService.parseUrlSearchToObj( null ) ).toEqual( {} );
    });

    it( 'should return empty object ( no argument passed )', () => {
        expect( filteringSortingService.parseUrlSearchToObj() ).toEqual( {} );
    });
});

describe( 'parseSearchObjToUrl', () => {

    it( 'should parse the object', () => {
         expect( filteringSortingService.parseSearchObjToUrl( objFromSearchUrl )).toEqual( '&status=any&freeText=quick%20search&severity=[minor,major]&dates=all' );
    });

    it( 'should parse the object', () => {
        expect( filteringSortingService.parseSearchObjToUrl( objFromSearchUrl_b )).toEqual( '&status=open&freeText=&severity=[minor]&dates=all' );
    });

    it( 'should return empty string ( empty object passed ) ', () => {
        expect( filteringSortingService.parseSearchObjToUrl( {} )).toEqual( '' );
    });

    it( 'should return empty string ( empty string passed ) ', () => {
        expect( filteringSortingService.parseSearchObjToUrl( '' )).toEqual( '' );
    });

    it( 'should return empty string ( null passed ) ', () => {
        expect( filteringSortingService.parseSearchObjToUrl( null )).toEqual( '' );
    });

    it( 'should return empty string ( no arguments passed ) ', () => {
        expect( filteringSortingService.parseSearchObjToUrl( )).toEqual( '' );
    });
});
