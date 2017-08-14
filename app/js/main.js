jQuery(document).ready(function() {
	    //Mobile navigation
    var touchLink = $('.mob-nav');
    var headerMenu = $('.header--nav');
    $(touchLink).on('click', function() {
    	$(headerMenu).toggleClass('show-mob');
    });

    //gallery
    $('#gallery-control img').each(function() {
    	var imgFile = $(this).attr('src');
		var preloadImage = new Image();
  		var imgExt = /(\.\w{3,4}$)/;

  		preloadImage.src = imgFile.replace(imgExt,'-big$1');
		
    });

    $('#gallery-control a').click(function(evt) {

		evt.preventDefault();

	   	var imgPath = $(this).attr('href');
		var oldImage = $('#photo-gallery img');
		var newImage = $('<img src="' + imgPath +'">');

		newImage.hide();

		$('#photo-gallery').prepend(newImage);

		newImage.fadeIn(1000);
			 
		oldImage.fadeOut(1000,function(){
			$(this).remove();
		});		 
	}); 
		
	$('#gallery-control a:first').click();


	//validate form

	$('#myForm [name="tel"]').bind("change keyup input click", function() {
	    if (this.value.match(/[^0-9]/g)) {
	        this.value = this.value.replace(/[^0-9]/g, '');
	    }
	});

	$("#myForm").validate({
		rules: {
			name: {
				required: true,
				minlength: 3
			},
			email: {
				required: true,
				email: true
			},
			tel: {
				required: true,
			}
		},
		messages: {
			name: "Please specify your name",
		    email: {
		      	required: "We need your email address to contact you",
		      	email: "Your email address must be in the format of name@domain.com"
		    }

		}
	});
});