/*
 scrollControl 0.6 | (c) 2012-2013 Ludo Goarin. | github.com/ludogoarin | MIT License
*/

var scrollControl = {
    scrollClass: 'scrollable',
    startX: 0,
    startY: 0,

    touchStart: function (e) {
        this.startY = e.touches[0].clientY;
    },

    touchMove: function (e) {
        // check moving direction
        var currentY = e.touches[0].clientY;
        var moveY = currentY - this.startY;
        this.startY = currentY;
        var isMovingDown = moveY < 0;

        // analyze target
        var target = e.targetTouches[0].target;
        var parentScroll = $(target).parents('.' + this.scrollClass);
        var isScrollableTarget = $(target).hasClass(this.scrollClass);
        var hasScrollableParent = parentScroll.length > 0;
        var firstScrollableParent = hasScrollableParent ? parentScroll[0] : null;

        // do we have a scrollable container?
        var scrollContainer = isScrollableTarget ? target : firstScrollableParent;
        if (scrollContainer != null) {

            var firstChild = $(scrollContainer).find(":first");

            if (firstChild != null) {
                var parentPosition = $(scrollContainer).offset();
                var parentBorderTop = Number($(scrollContainer).css('border-top-width').replace(/[^-\d\.]/g, ''));
                var parentPaddingTop = Number($(scrollContainer).css('padding-top').replace(/[^-\d\.]/g, ''));
                var parentBorderBottom = Number($(scrollContainer).css('border-bottom-width').replace(/[^-\d\.]/g, ''));
                var parentPaddingBottom = Number($(scrollContainer).css('padding-bottom').replace(/[^-\d\.]/g, ''));
                var visibleHeight = $(scrollContainer).height();
                var scrollHeight = scrollContainer.scrollHeight - parentPaddingTop - parentPaddingBottom;

                var childPosition = $(firstChild).offset();
                var childBorderTop = Number($(firstChild).css('border-top-width').replace(/[^-\d\.]/g, ''));
                var childPaddingTop = Number($(firstChild).css('padding-top').replace(/[^-\d\.]/g, ''));
                var childMarginTop = Number($(firstChild).css('margin-top').replace(/[^-\d\.]/g, ''));
                var childBorderBottom = Number($(firstChild).css('border-bottom-width').replace(/[^-\d\.]/g, ''));
                var childMarginBottom = Number($(firstChild).css('margin-bottom').replace(/[^-\d\.]/g, ''));

                // check top
                var contentBoundTopY = parentPosition.top + parentPaddingTop + parentBorderTop;
                var isTopBound = contentBoundTopY - childPosition.top <= 0;

                // check bottom
                var contentBoundBottomY = 0;
                var distanceFromBottom = (scrollHeight - visibleHeight) - scrollContainer.scrollTop;
                var isBottomBound = distanceFromBottom <= 0;
            }
        }

        // check various cases
        var preventScroll =
		// not supposed to scroll
				(!hasScrollableParent && !isScrollableTarget) ||
		// already at the top and trying to move up
				(isTopBound && !isMovingDown) ||
		// already at the bottom and trying to move down
				(isBottomBound && isMovingDown);

        // stop scrolling?
        if (preventScroll) {
            e.preventDefault();
        }

    }
}
