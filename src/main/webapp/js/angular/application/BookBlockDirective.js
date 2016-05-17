cdaApp.directive('bookblock', function($timeout) {
    return {
    restrict:'AE',
    link: function(scope, element, attrs) {
    	
    	$timeout(function() {
        bookBlock =  element, // $(element).find("#bb-bookblock"),
        navNext = $(document).find('.bb-nav-next'),
        navPrev = $(document).find( '.bb-nav-prev'),
        navMenu = $(document).find('.bb-nav-menu'),
        dropDownMenu = $(document).find('.bb-dropdown-menu'),
        navDot = $(document).find('.dot'),

        bb = element.bookblock( {
            speed : 800,
            perspective : 2000,
            shadowSides : 0.8,
            shadowFlip  : 0.4,
            });

                var slides = bookBlock.children();
                
                navMenu.each( function( i ) {
					$( this ).on( 'click touchstart', function( event ) {
						var menuItem = $( this );
						navDot.removeClass( 'selected' );
						navMenu.removeClass('active');
						dropDownMenu.removeClass('active');
						$(navDot.get(i)).addClass('selected');
						$(dropDownMenu.get(i)).addClass('active');
						menuItem.addClass('active');
						element.bookblock( 'jump', i + 1 );
						return false;
					} );
				} );
                
                dropDownMenu.each( function( i ) {
					$( this ).on( 'click touchstart', function( event ) {
						var menuItem = $( this );
						navDot.removeClass( 'selected' );
						navMenu.removeClass('active');
						dropDownMenu.removeClass('active');
						$(navDot.get(i)).addClass('selected');
						$(navMenu.get(i)).addClass('active');
						menuItem.addClass('active');
						element.bookblock( 'jump', i + 1 );
						return false;
					} );
				} );
                
                navDot.each( function( i ) {
					$( this ).on( 'click touchstart', function( event ) {
						var dot = $( this );
						navDot.removeClass( 'selected' );
						navMenu.removeClass('active');
						dropDownMenu.removeClass('active');
						$(dropDownMenu.get(i)).addClass('active');
						$(navMenu.get(i)).addClass('active');
						dot.addClass( 'selected' );
						element.bookblock( 'jump', i + 1 );
						return false;
					} );
				} );
                
             // add navigation events
                navNext.on( 'click touchstart', function() {
                	var index = $(navDot).closest('.scrubber').find('.selected').index();
                	navDot.removeClass( 'selected' );
                	navMenu.removeClass('active');
                	$(navDot.get(index + 1)).addClass('selected');
                	$(navMenu.get(index + 1)).addClass('active');
                	dropDownMenu.removeClass('active');
					$(dropDownMenu.get(index + 1)).addClass('active');
                    element.bookblock( 'next' );
                    return false;
                } );

                navPrev.on( 'click touchstart', function() {
                	var index = $(navDot).closest('.scrubber').find('.selected').index();
                	navDot.removeClass( 'selected' );
                	navMenu.removeClass('active');
                	$(navDot.get(index -1)).addClass('selected');
                	$(navMenu.get(index -1)).addClass('active');
                	dropDownMenu.removeClass('active');
					$(dropDownMenu.get(index - 1)).addClass('active');
                    element.bookblock( 'prev' );
                    return false;
                } );

                // add swipe events
                slides.on( {
                    'swipeleft' : function( event ) {
                        bookBlock.bookblock( 'next' );
                        return false;
                    },
                    'swiperight' : function( event ) {
                        bookBlock.bookblock( 'prev' );
                        return false;
                    }
                } );

                // add keyboard events
                $( document ).keydown( function(e) {
                    var keyCode = e.keyCode || e.which,
                        arrow = {
                            left : 37,
                            up : 38,
                            right : 39,
                            down : 40
                        };

                    switch (keyCode) {
                        case arrow.left:
                            bookBlock.bookblock( 'prev' );
                            break;
                        case arrow.right:
                            bookBlock.bookblock( 'next' );
                            break;
                    }
                } );
    	}, 0);
    }
    };
});