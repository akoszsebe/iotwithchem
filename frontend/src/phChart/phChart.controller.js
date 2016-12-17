(() => {
	var app = angular.module('kemia-app')
	app.controller('phChartController', phChartController)

	phChartController.$inject = ['$scope', 'phChartFactory', 'moment','$interval']

	function phChartController($scope, phChartFactory, moment,$interval)
	{
		let p=this

		p.ph=0.0

		$interval(getPhInterval, 1000)

		function getPhInterval()
		{
			var datefrom = new moment().valueOf()-24*60*60*1000
			var dateto = new moment().valueOf()
			return phChartFactory.getPhInterval(1, datefrom, dateto)
			.then((data) => {
				console.log('ph sensor: ', datefrom, dateto)
				$scope.phV = []
				$scope.phD = []
				let temporaryPhs = []
				let temporaryDates = []
				for (let i = 1; i < data.length; i += 1)
				{
					let date = (new moment(parseInt(data[i].phdate)).toISOString().split('.'))[0].replace('T',' ')
					if(temporaryPhs[temporaryPhs.length-1] != data[i].phvalue)
					{
						temporaryPhs.push(data[i].phvalue)
						temporaryDates.push(moment(date).format('YY/MM/DD, h:mm:ss a'))
					}
				}
				$scope.phV = [temporaryPhs]
				$scope.phD = temporaryDates

				$scope.onClick = function (points, evt)
				{
					console.info(points, evt)
				}
				$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }]
				$scope.options = {
					scales: {
						yAxes: [
							{
								id: 'y-axis-1',
								type: 'linear',
								display: true,
								position: 'left'
							}
						]
					}
				}
				return p.ph
			})
		}
	}
})()
