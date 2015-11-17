/**
 * Returns a new input guard.
 * 
 * A input guard guards an input node that is associated to a set of other input nodes.
 * If all of the associated input nodes are empty, i. e. there's no
 * input in them, the guarded input is disabled. Otherwise it is enabled.
 *
 * @param  {Function} $				The jQuery function object
 * @param  {jQuery}   btn_node 		The input node
 * @param  {jQUery}   assoc_nodes	The associated input node set
 */
function get_input_guard($, btn_node, assoc_nodes) {
	/**
	 * Input helper.
	 *
	 * Calls given callbacks when an input is
	 * edited or cleared.
	 *
	 * @param {Function} cb_is_empty 	 Called with the input nodes. Returns true if nodes are empty.
	 * @param {string} 	 event_name 	 Name of the event to listen for
	 */
	function _Input_helper(cb_is_empty, event_name) {
		this._nodes = {
			/**
			 * The input node set that is being listened to
			 * @type {jQuery}
			 */
			inputs : null
		};

		this._event_name = event_name;

		/**
		 * Begin to listen
		 * @param  {jQuery} nodes 		 An input node set
	 	 * @param  {Function} cb_cleared Called when input is cleared
	 	 * @param  {Function} cb_edited  Called when input is edited (but not cleared)
		 */
		this.init = function(nodes, cb_cleared, cb_edited) {
			var self = this;
			self._nodes.inputs = nodes;
			self._nodes.inputs.on(self._event_name, function() {
				if (self._is_empty()) {
					cb_cleared();
				} else {
					cb_edited();
				}
			});
		};


		/**
		 * Returns true if the input is empty.
		 * 
		 * @return {Boolean}
		 */
		this._is_empty = function() {
			return cb_is_empty(this._nodes.inputs);
		};
	};


	var text_input = new _Input_helper(function(nodes) {
		// _is_empty()

		return nodes.filter(function() {
			return $(this).val().length > 0;
		}).length === 0;

	}, "keyup");

	var checkbox_input = new _Input_helper(function(nodes) {
		// _is_empty()
		
		return !nodes.is(":checked");
	}, "click");


	return {
		_nodes : {
			btn : btn_node
		},

		_input : null,

		/**
		 * Begin to listen
		 */
		init : function() {
			var self = this;
			var node_type = assoc_nodes.attr("type");

			if ($.inArray(node_type, ["text", "number", "checkbox"]) !== -1) {
				if ($.inArray(node_type, ["text", "number"]) !== -1) {
					self._input = text_input;
				} else {
					self._input = checkbox_input;
				}
			} else {
				throw new Error("Input type '" + node_type + "' not supported.");
			}

			self._input.init(assoc_nodes, function() {
				self._disable_btn();
			}, function() {
				self._enable_btn();
			});
		},


		_disable_btn : function() {
			this._nodes.btn.attr("disabled", true);
		},


		_enable_btn : function() {
			this._nodes.btn.attr("disabled", false);
		}
	};
};
