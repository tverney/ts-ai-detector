module.exports = {
	preset: 'ts-jest',
	moduleNameMapper: {
		'^axios$': 'axios/dist/node/axios.cjs',
	},
	transform: {
		'^.+\\.(ts|tsx)?$': 'ts-jest',
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
};
