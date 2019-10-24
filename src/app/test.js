
	function PlaygroundController($scope, $http) {
		$scope.examples = [];

		var editor = ace.edit('editor');
		setupEditor(editor);
		var names = ['basics', 'styles1', 'styles2', 'styles3', 'columns', 'tables', 'lists', 'margin', 'images' ];

		var i = 0;
		['basics', 'named-styles', 'inline-styling', 'style-overrides', 'columns', 'tables', 'lists', 'margins', 'images'].forEach(function(example) {
			$scope.examples.push({
				name: names[i++],
				activate: function() {
					$http.get('samples/' + example).success(function(data) {
						editor.getSession().setValue('// playground requires you to assign document definition to a variable called dd\n\nvar dd = {\n' + data.replace(/(\r?)\n/g, '\n').replace(/(^)/gm, '\t') + '\n}');
					});
				}
			});
		});

		var old = localStorage.pdfMakeDD;

		if (!old) {
			$scope.examples[0].activate();
		} else {
			editor.getSession().setValue(old);
		}

		var timer;

		function setupEditor() {
			var lastGen, lastChanged;

			editor.setTheme('ace/theme/monokai');
			editor.getSession().setMode('ace/mode/javascript');

			editor.getSession().on('change', function(e) {
				if (timer) {
					clearTimeout(timer);
				}
				lastChanged = new Date();

				localStorage.pdfMakeDD = editor.getSession().getValue();

				timer = setTimeout(function() {
					if (!lastGen || lastGen < lastChanged) {
						generate();
					};
				}, 300);
			});

			function generate() {
				lastGen = new Date();

				eval(editor.getSession().getValue());

				pdfMake.createPdf(dd).getDataUrl(function(outDoc) {
					$scope.$apply(function() {
						$scope.stats = 'generated in ' + (new Date().getTime() - lastGen.getTime()) + ' ms';
					});

					document.getElementById('pdfV').src = outDoc;

				});
			}

			$scope.print = function() {
				eval(editor.getSession().getValue());
				pdfMake.createPdf(dd).print();
			};

			$scope.openPdf = function() {
				eval(editor.getSession().getValue());
				pdfMake.createPdf(dd).open();
			};

			$scope.download = function() {
				eval(editor.getSession().getValue());
				pdfMake.createPdf(dd).download('sample.pdf');
			};
		}
	};
