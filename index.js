import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import errorhandler from 'errorhandler';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import glue from 'schemaglue';
import { mongooseSchema } from 'nepaltoday-db-service';

const isDevelopment = process.env.NODE_ENV === 'development';

// Configure Mongoose
mongoose.promise = global.Promise;
mongoose.connect(process.env.DATABASE_URL);
mongoose.set('debug', true);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (isDevelopment) {
	morganBody(app, { noColors: true, logRequestBody: true, logResponseBody: true });
} else {
	app.use(morgan('combined'));
}

if (isDevelopment) {
	app.use(errorhandler());
}

// Error handlers & middlewares
if (isDevelopment) {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);

		res.send({
			errors: {
				message: err.message,
				error: err
			}
		});
	});
}

app.use((err, req, res, next) => {
	res.status(err.status || 500);

	res.send({
		errors: {
			message: err.message,
			error: {}
		}
	});
});

const { schema, resolver } = glue('./src', { js: '**/resolver*.js' });

const server = new ApolloServer({
	typeDefs: schema,
	resolvers: resolver,
	context: ({ req, res }) => ({
		...{ userContext: req.payload },
		...mongooseSchema
	}),
	playground: {
		settings: {
			'editor.theme': 'light'
		}
	}
});

server.applyMiddleware({ app });

app.listen(process.env.PORT, () => console.log('Server running on http://localhost:', process.env.PORT));
