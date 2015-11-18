/**
 * Returns a new input guard.
 * 
 * An input guard guards a set of input nodes that is associated with another set of other input nodes.
 * The associated input nodes are being listened to after init() is called on the guard.
 * If all of the associated input nodes are made empty, i. e. there's no
 * input in them after an input event, the guarded input set is disabled. If there is input
 * after the event, the guarded set is enabled.
 *
 * @param  {Function} $			The jQuery function object
 * @param  {jQuery}   guard_nodes 	The guarded input nodes
 * @param  {jQUery}   assoc_nodes	The associated input node set
 */
function get_input_guard($, guard_nodes, assoc_nodes) {
	/**
	 * Input helper.
	 *
	 * Calls given callbacks when an input is
	 * edited or cleared.
	 *
	 * @param {Function} cb_is_empty 	 Called with the input nodes. Returns true if nodes are empty.
	 * @param {string}   event_name 	 Name of the event to listen for
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
		return nodes.filter(function() {
			return $(this).val().length > 0;
		}).length === 0;

	}, "keyup");

	var checkbox_input = new _Input_helper(function(nodes) {
		return !nodes.is(":checked");
	}, "click");


	return {
		_nodes : {
			nodes : guard_nodes
		},

		_assoc_inputs : null,

		/**
		 * Begin to listen
		 */
		init : function() {
			var self = this;
			var node_type = assoc_nodes.attr("type");

			if ($.inArray(node_type, ["text", "number", "checkbox"]) !== -1) {
				if ($.inArray(node_type, ["text", "number"]) !== -1) {
					self._assoc_inputs = text_input;
				} else {
					self._assoc_inputs = checkbox_input;
				}
			} else {
				throw new Error("Input type '" + node_type + "' not supported.");
			}

			self._assoc_inputs.init(assoc_nodes, function() {
				self._disable_nodes();
			}, function() {
				self._enable_nodes();
			});
		},


		_disable_nodes : function() {
			this._nodes.nodes.attr("disabled", true);
		},


		_enable_nodes : function() {
			this._nodes.nodes.attr("disabled", false);
		}
	};
};
