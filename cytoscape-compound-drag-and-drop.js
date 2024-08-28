(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeCompoundDragAndDrop"] = factory();
	else
		root["cytoscapeCompoundDragAndDrop"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 658:
/***/ ((module) => {

// Simple, internal Object.assign() polyfill for options objects etc.
module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.filter(function (src) {
    return src != null;
  }).forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });
  return tgt;
};

/***/ }),

/***/ 738:
/***/ ((module) => {

/* eslint-disable no-unused-vars */
module.exports = {
  grabbedNode: function grabbedNode(node) {
    return true;
  },
  // filter function to specify which nodes are valid to grab and drop into other nodes
  dropTarget: function dropTarget(_dropTarget, grabbedNode) {
    return true;
  },
  // filter function to specify which parent nodes are valid drop targets
  dropSibling: function dropSibling(_dropSibling, grabbedNode) {
    return true;
  },
  // filter function to specify which orphan nodes are valid drop siblings
  newParentNode: function newParentNode(grabbedNode, dropSibling) {
    return {};
  },
  // specifies element json for parent nodes added by dropping an orphan node on another orphan (a drop sibling)
  boundingBoxOptions: {
    // same as https://js.cytoscape.org/#eles.boundingBox, used when calculating if one node is dragged over another
    includeOverlays: false,
    includeLabels: true
  },
  overThreshold: 10,
  // make dragging over a drop target easier by expanding the hit area by this amount on all sides
  outThreshold: 10 // make dragging out of a drop target a bit harder by expanding the hit area by this amount on all sides

};

/***/ }),

/***/ 904:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assign = __webpack_require__(658);

var defaults = __webpack_require__(738);

var toggle = __webpack_require__(43);

var listeners = __webpack_require__(444);

var DragAndDrop = function DragAndDrop(cy, options) {
  this.cy = cy;
  this.options = assign({}, defaults, options);
  this.listeners = [];
  this.enabled = true;
  this.addListeners();
};

var destroy = function destroy() {
  this.removeListeners();
};

[toggle, listeners, {
  destroy: destroy
}].forEach(function (def) {
  assign(DragAndDrop.prototype, def);
});

module.exports = function (options) {
  var cy = this;
  return new DragAndDrop(cy, options);
};

/***/ }),

/***/ 444:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(235),
    isParent = _require.isParent,
    isChild = _require.isChild,
    isOnlyChild = _require.isOnlyChild,
    getBounds = _require.getBounds,
    getBoundsTuple = _require.getBoundsTuple,
    boundsOverlap = _require.boundsOverlap,
    expandBounds = _require.expandBounds,
    getBoundsCopy = _require.getBoundsCopy,
    setParent = _require.setParent,
    removeParent = _require.removeParent,
    cursor;

var addListener = function addListener(event, selector, callback) {
  this.listeners.push({
    event: event,
    selector: selector,
    callback: callback
  });

  if (selector == null) {
    this.cy.on(event, callback);
  } else {
    this.cy.on(event, selector, callback);
  }
};

var addListeners = function addListeners() {
  var _this = this;

  var options = this.options,
      cy = this.cy;

  var isMultiplySelected = function isMultiplySelected(n) {
    return n.selected() && cy.elements('node:selected').length > 1;
  };

  var canBeGrabbed = function canBeGrabbed(n) {
    return !isMultiplySelected(n) && options.grabbedNode(n);
  };

  var canBeDropTarget = function canBeDropTarget(n) {
    return !n.same(_this.grabbedNode) && options.dropTarget(n, _this.grabbedNode) & !n.ancestors().has(_this.grabbedNode) & !_this.grabbedNode.ancestors().has(n);
  };

  var canBeDropSibling = function canBeDropSibling(n) {
    return !n.same(_this.grabbedNode) && options.dropSibling(n, _this.grabbedNode) & !n.ancestors().has(_this.grabbedNode) & !_this.grabbedNode.ancestors().has(n);
  };

  var canPullFromParent = function canPullFromParent(n) {
    return isChild(n);
  };

  var getBoundTuplesNode = function getBoundTuplesNode(n) {
    return getBoundsTuple(n, options.boundingBoxOptions, options.overThreshold);
  };

  var canBeInBoundsTuple = function canBeInBoundsTuple(n) {
    return (canBeDropTarget(n) || canBeDropSibling(n)) && !n.same(_this.dropTarget) && !n.hasClass("cdnd-fake-parent");
  };

  var updateBoundsTuples = function updateBoundsTuples() {
    return _this.boundsTuples = cy.nodes(canBeInBoundsTuple).map(getBoundTuplesNode);
  };

  var reset = function reset() {
    _this.grabbedNode.removeClass('cdnd-grabbed-node');

    _this.dropTarget.removeClass('cdnd-drop-target');

    _this.dropSibling.removeClass('cdnd-drop-sibling');

    _this.grabbedNode = cy.collection();
    _this.dropTarget = cy.collection();
    _this.dropSibling = cy.collection();
    _this.dropTargetBounds = null;
    _this.boundsTuples = [];
    _this.inGesture = false;
  };

  this.addListener('grab', 'node', function (e) {
    var node = e.target;

    if (!_this.enabled || !canBeGrabbed(node)) {
      return;
    }

    _this.inGesture = true;
    _this.grabbedNode = node;
    _this.dropTarget = cy.collection();
    _this.dropSibling = cy.collection();

     grabbedParent = _this.grabbedNode.parent();

     if (parentBB == null) {
        parentBB = getBounds(grabbedParent, options.boundingBoxOptions);
     }

     presentNewSibling = null;
     presentNewParent = null;
     
    if (canPullFromParent(node)) {
      _this.dropTarget = node.parent();
      _this.dropTargetBounds = getBoundsCopy(_this.dropTarget, options.boundingBoxOptions);
    }

    updateBoundsTuples();

    _this.grabbedNode.addClass('cdnd-grabbed-node');

    _this.dropTarget.addClass('cdnd-drop-target');

    console.log("emit('cdndgrab');");
    node.emit('cdndgrab');
  });
  this.addListener('add', 'node', function (e) {
    if (!_this.inGesture || !_this.enabled) {
      return;
    }

    var newNode = e.target;

    if (canBeInBoundsTuple(newNode)) {
      _this.boundsTuples.push(getBoundsTuple(newNode, options.boundingBoxOptions, options.overThreshold));
    }
  });
  this.addListener('remove', 'node', function (e) {
    if (!_this.inGesture || !_this.enabled) {
      return;
    }

    var rmedNode = e.target;
    var rmedIsTarget = rmedNode.same(_this.dropTarget);
    var rmedIsSibling = rmedNode.same(_this.dropSibling);
    var rmedIsGrabbed = rmedNode.same(_this.grabbedNode); // try to clean things up if one of the drop nodes is removed

    if (rmedIsTarget || rmedIsSibling || rmedIsGrabbed) {
      if (rmedIsGrabbed) {
        reset();
      } else {
        _this.dropTarget = cy.collection();
        _this.dropSibling = cy.collection();
        updateBoundsTuples();
      }
    }
  });
  
  var grabbedParent;
  var parentBB;
  var presentNewSibling;
  var presentNewParent;

  this.addListener('drag', 'node', function (e) {
    if (!_this.inGesture || !_this.enabled) {
        return;
    }





    var getBounds = function getBounds(n, boundingBoxOptions) {
        return n.boundingBox(boundingBoxOptions);
    };

    function pointInsideRect(p, rect) {
        return p.x >= rect.x1 && p.x <= rect.x2 && p.y >= rect.y1 && p.y <= rect.y2;
    }

    cursor = e.target.position();


    // 1. Check if if has been grabbed outside its parent.
    var candidateFormerParent = null;


    if (grabbedParent.nonempty()) {

      if (!pointInsideRect(cursor, parentBB)) {

        // Grabbed outside its present parent
        candidateFormerParent = grabbedParent;

        if (_this.dropTarget.nonempty()) {

          // already in a parent
          var bb = expandBounds(getBounds(_this.grabbedNode, options.boundingBoxOptions), options.outThreshold);
          var parent = _this.dropTarget;
          var sibling = _this.dropSibling;
          var grabbedIsOnlyChild = isOnlyChild(_this.grabbedNode);

          removeParent(_this.grabbedNode);
          removeParent(_this.dropSibling);

          _this.dropTarget.removeClass('cdnd-drop-target');

          _this.dropSibling.removeClass('cdnd-drop-sibling');

          var isFakeParent = _this.dropTarget && _this.dropTarget.hasClass('cdnd-fake-parent');

          if ((_this.dropSibling.nonempty() // remove extension-created parents on out
            || grabbedIsOnlyChild) && isFakeParent // remove empty parents
          ) {
            _this.dropTarget.remove();
          }

          _this.dropTarget = cy.collection();
          _this.dropSibling = cy.collection();
          _this.dropTargetBounds = null;

          if (isFakeParent) {
            updateBoundsTuples();
          }

          console.log("emit('cdndout', [" + parent.data('id') + ", " + sibling.data('id') +"]);");
          _this.grabbedNode.emit('cdndout', [parent, sibling]);

        }
      }
    }


    // 2. Find new situation: Maybe new parent or new sibling

    var cursorInTuple = function cursorInTuple(t) {
        return !t.node.removed() && pointInsideRect(cursor, t.bb);
    };

    var cursorBesidesTuple = function cursorBesidesTuple(t) {
        return !t.node.removed() && pointInsideRect(cursor, t.bbb);
    };

    var possibleInTargets = _this.boundsTuples.filter(cursorInTuple).map(function (t) {
        return t.node;
    });




    //    console.log("findCrossingEdges(draggedNode)"); 

    // Filter edges based on their intersection with the bounding box
    crossingEdges= cy.edges().filter(function (edge) {
      const edgeStart = edge.source().position();
      const edgeEnd = edge.target().position();

      // Check if any line segment of the edge intersects the bounding box
      return isPointCloseToSegment(edgeStart, edgeEnd,cursor, 20); 
    });


    console.log("crossingEdges=" + (crossingEdges.length > 0 ? crossingEdges.first().data('id') + " (" + crossingEdges.length + ")" : "-" ));


    cy.edges().removeClass("crossedEdge");
    crossingEdges.addClass("crossedEdge");
    

    

    function isPointCloseToSegment(p1, p2, q, dist) {
 

      // Calculate distance from p1 to p2
      let distP1P2 = distance(p1, p2);

      // Check distance from q to p1
      let distQp1 = distance(q, p1);
      if (distQp1 > distP1P2) {
        return false;
      }

      // Check distance from q to p2
      let distQp2 = distance(q, p2);
      if (distQp2 > distP1P2) {
        return false;
      } 

      // Check if the perpendicular distance is within the given distance
      return pointToLineDistance(p1, p2, q) <= dist;
    }

    // Function to calculate the Euclidean distance between two points
    function distance(p, q) {
      return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
    }

    // Function to calculate the perpendicular distance from q to the line segment p1-p2
    function pointToLineDistance(p1, p2, q) {
      let dx = p2.x - p1.x;
      let dy = p2.y - p1.y;

      // Handle the case when p1 and p2 are the same point
      if (dx === 0 && dy === 0) {
        return distance(p1, q);
      }

      // Compute the projection factor of q onto the line segment
      let t = ((q.x - p1.x) * dx + (q.y - p1.y) * dy) / (dx * dx + dy * dy);
      t = Math.max(0, Math.min(1, t)); // Clamp t to the segment

      // Find the closest point on the line segment to q
      let closestX = p1.x + t * dx;
      let closestY = p1.y + t * dy;

      // Calculate the distance from q to the closest point
      let closestPoint = { x: closestX, y: closestY };
      return distance(q, closestPoint);
    }


    //--------------------------------------------

    var possibleBesidesTargets = _this.boundsTuples.filter(cursorBesidesTuple).map(function (t) {
        return t.node;
    });



    function minDistanceToPoint(point, rect) {

      const { x: px, y: py } = point;
      const { x1, y1, x2, y2 } = rect;

      // Check if point is inside the rectangle
      if (px >= x1 && px <= x2 && py >= y1 && py <= y2) {
        return Math.min(Math.abs(px - x1), Math.abs(px - x2), Math.abs(py - y1), Math.abs(py - y2));
      }

      // Determine the region of the point
      const isLeft = px < x1;
      const isRight = px > x2;
      const isTop = py < y1;
      const isBottom = py > y2;

      // Calculate distances based on region
      if (isLeft && isTop) {
        return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2); // Top-left corner
      } else if (isRight && isTop) {
        return Math.sqrt((px - x2) ** 2 + (py - y1) ** 2); // Top-right corner
      } else if (isLeft && isBottom) {
        return Math.sqrt((px - x1) ** 2 + (py - y2) ** 2); // Bottom-left corner
      } else if (isRight && isBottom) {
        return Math.sqrt((px - x2) ** 2 + (py - y2) ** 2); // Bottom-right corner
      } else if (isLeft) {
        return Math.abs(px - x1); // Left side
      } else if (isRight) {
        return Math.abs(px - x2); // Right side
      } else if (isTop) {
        return Math.abs(py - y1); // Top side
      } else {
        return Math.abs(py - y2); // Bottom side
      }
    }


    const getBestTarget = function (pos, nodes, expand) {
      let closestNode = null;
      let minDistance = Infinity;


      nodes.forEach(function (node) {
        var nodeBounds = getBounds(node, options.boundingBoxOptions);

        if (expand) nodeBounds = expandBounds(nodeBounds, options.outThreshold);

        const distance = minDistanceToPoint(pos, nodeBounds);

        if (distance < minDistance) {
          closestNode = node;
          minDistance = distance;
        }
      });

      return {
        node: closestNode,
        distance: minDistance
      }
    };

    var bestIn = getBestTarget(cursor, possibleInTargets, false);
    
    var bestBeside = getBestTarget(cursor, possibleBesidesTargets, true);

    if (bestIn.distance == Infinity && bestBeside.distance == Infinity) {
        return;
    }

    if (bestIn.distance < Infinity && bestIn.distance < bestBeside.distance) {

        _sibling = cy.collection();
        _parent = bestIn.node;


        _parent.addClass('cdnd-new-parent');

        setParent(_this.grabbedNode, _parent);

    }

    if (bestBeside.distance < Infinity && bestBeside.distance < bestIn.distance) {

      //  Let's create a parent for both dragged & Beside
      _sibling = bestBeside.node;


      _parent = _sibling.parent();

      if (_parent.empty()) {


        var newLocal;

        var desiredId = _this.grabbedNode.data('id') + "+" + _sibling.data('id');
        var uniqueId = desiredId;
        var counter = 0;

        // Check if the desired ID already exists
        while (cy.getElementById(uniqueId).nonempty()) {
            counter++;
            uniqueId = desiredId + "(" + counter + ")"; // Append a number to create a unique ID
        }

        var newLocal = {
            group: 'nodes',
            data: {
              id: uniqueId,
            },
            classes: ['cdnd-fake-parent', 'cdnd-new-parent', 'cdnd-auto-parent']
        };

        _parent = cy.add(newLocal);

        setParent(_sibling, _parent);
      }
      
      setParent(_this.grabbedNode, _parent);
      
      _sibling.addClass('cdnd-drop-sibling');
    }

    _parent.addClass('cdnd-drop-target');

    _this.dropTarget = _parent;
    _this.dropSibling = _sibling;

    if (presentNewSibling?.data('id') != _sibling?.data('id')) {                                                       
      presentNewSibling = _sibling;
    }


    if (presentNewParent?.data('id') != _parent?.data('id')) {
      if (presentNewParent != null && presentNewParent.hasClass('cdnd-fake-parent')) {

        selected = cy.$('.cdnd-fake-parent');
        //            presentNewParent.remove();
        selected.children().move({ parent: (selected.parent().id() ? selected.parent().id() : null) });
        selected.remove();
      }
      presentNewParent = _parent;
    }
  });

  this.addListener('free', 'node', function () {
    if (!_this.inGesture || !_this.enabled) {
      return;
    }


    cy.nodes('.cdnd-auto-parent').filter(function (node) {
      const children = node.children();
      if (children.length === 1) {
         // Move the single descendant to the root
         children.first().move({ parent: null });
      }
      return children.length <= 1;
    }).remove();

    cy.nodes().removeClass('cdnd-fake-parent');
    cy.nodes().removeClass('cdnd-drop-sibling');
    cy.nodes().removeClass('cdnd-grabbed-node'); 
    var grabbedNode = _this.grabbedNode,
        dropTarget = _this.dropTarget,
        dropSibling = _this.dropSibling;
    reset();


    console.log("emit('cdnddrop', [" + dropTarget.data('id') + ", " + dropSibling.data('id') + "]);");
    grabbedNode.emit('cdnddrop', [dropTarget, dropSibling]);
  });
};

var removeListeners = function removeListeners() {
  var cy = this.cy;
  this.listeners.forEach(function (lis) {
    var event = lis.event,
        selector = lis.selector,
        callback = lis.callback;

    if (selector == null) {
      cy.removeListener(event, callback);
    } else {
      cy.removeListener(event, selector, callback);
    }
  });
  this.listeners = [];
};

module.exports = {
  addListener: addListener,
  addListeners: addListeners,
  removeListeners: removeListeners
};

/***/ }),

/***/ 43:
/***/ ((module) => {

function enable() {
  this.enabled = true;
}

function disable() {
  this.enabled = false;
}

module.exports = {
  enable: enable,
  disable: disable
};

/***/ }),

/***/ 235:
/***/ ((module) => {

var isParent = function isParent(n) {
  return n.isParent();
};

var isChild = function isChild(n) {
  return n.isChild();
};

var isOnlyChild = function isOnlyChild(n) {
  return isChild(n) && n.parent().children().length === 1;
};

var getBounds = function getBounds(n, boundingBoxOptions) {
  return n.boundingBox(boundingBoxOptions);
};

var getBoundsTuple = function getBoundsTuple(n, boundingBoxOptions, overThreshold) {
  const originalBb = getBounds(n, boundingBoxOptions);                                                     
  return {
    node: n,
     bb: copyBounds(originalBb),
     bbb: copyBounds(expandBounds(originalBb, overThreshold))
  };
};

var copyBounds = function copyBounds(bb) {
  return {
    x1: bb.x1,
    x2: bb.x2,
    y1: bb.y1,
    y2: bb.y2,
    w: bb.w,
    h: bb.h
  };
};

var getBoundsCopy = function getBoundsCopy(n, boundingBoxOptions) {
  return copyBounds(getBounds(n, boundingBoxOptions));
};

var removeParent = function removeParent(n) {
  return n.move({
    parent: null
  });
};

var setParent = function setParent(n, parent) {
  return n.move({
    parent: parent.id()
  });
};

var boundsOverlap = function boundsOverlap(bb1, bb2) {
  // case: one bb to right of other
  if (bb1.x1 > bb2.x2) {
    return false;
  }

  if (bb2.x1 > bb1.x2) {
    return false;
  } // case: one bb to left of other


  if (bb1.x2 < bb2.x1) {
    return false;
  }

  if (bb2.x2 < bb1.x1) {
    return false;
  } // case: one bb above other


  if (bb1.y2 < bb2.y1) {
    return false;
  }

  if (bb2.y2 < bb1.y1) {
    return false;
  } // case: one bb below other


  if (bb1.y1 > bb2.y2) {
    return false;
  }

  if (bb2.y1 > bb1.y2) {
    return false;
  } // otherwise, must have some overlap


  return true;
};

var expandBounds = function expandBounds(bb, padding) {
  return {
    x1: bb.x1 - padding,
    x2: bb.x2 + padding,
    w: bb.w + 2 * padding,
    y1: bb.y1 - padding,
    y2: bb.y2 + padding,
    h: bb.h + 2 * padding
  };
};

module.exports = {
  isParent: isParent,
  isChild: isChild,
  isOnlyChild: isOnlyChild,
  getBoundsTuple: getBoundsTuple,
  boundsOverlap: boundsOverlap,
  getBounds: getBounds,
  expandBounds: expandBounds,
  copyBounds: copyBounds,
  getBoundsCopy: getBoundsCopy,
  removeParent: removeParent,
  setParent: setParent
};

/***/ }),

/***/ 579:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var impl = __webpack_require__(904); // registers the extension on a cytoscape lib ref


var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified


  cytoscape('core', 'compoundDragAndDrop', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(579);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});