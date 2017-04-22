module.exports = app => {
	const Tasks = app.db.models.Tasks;

	app.route('/tasks')
		.all(app.auth.authenticate())
		.get((req, res) => {
			Tasks.findAll({
					where: {user_id: req.user.id}
				})
				.then(result => {
					res.json(result);
				})
				.catch(error => {
					res.status(412).json({msn: error.message});
				});
		})
		.post((req, res) => {
			req.body.user_id = req.body.id;
			Tasks.create(req.body)
				.then(result => {
					res.json(result);
				})
				.catch(error => {
					res.status(412).json({msn: error.message});
				});
		});

	app.route('/tasks/:id')
		.all(app.auth.authenticate())
		.get((req, res) => {
			Tasks.findOne({where: {
				id: req.params.id,
				user_id: req.user.id
			}})
				.then(result => {
					if (result) {
						res.json(result);
					} else {
						res.sendStatus(404);
					}
				})
				.catch(error => {
					res.status(412).json({msn: error.message});
				});
		})
		.put((req, res) => {
			Tasks.update(req.body, {where: {
				id: req.params.id,
				user_id: req.user.id
			}})
				.then(result => {
					res.sendStatus(204);
				})
				.catch(error => {
					res.status(412).json({msn: error.message});
				});
		})
		.delete((req, res) => {
			Tasks.destroy({where: {
				id: req.params.id,
				user_id: req.user.id
			}})
				.then(result => {
					res.sendStatus(204);
				})
				.catch(error => {
					res.status(412).json({msn: error.message});
				});
		});
};