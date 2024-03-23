const themes = {
	default: {
		colors: {
			background: 'bg-white',
			primaryText: 'text-black',
			secondaryText: 'text-neutral-500'
		},
		components: {
			socialButton: `bg-white border border-neutral-100 text-neutral-900 p-1.5 rounded-lg shadow-md hover:bg-neutral-100`,
			scrollButton: `bg-white border border-neutral-100 text-neutral-900 p-1.5 rounded-full shadow-md hover:bg-neutral-100`
		}
	},
	dark: {
		colors: {
			background: 'bg-neutral-900',
			primaryText: 'text-neutral-100',
			secondaryText: 'text-neutral-200'
		},
		components: {
			socialButton: 'bg-neutral-800 text-white p-1.5 rounded-lg shadow-md hover:bg-neutral-600',
			scrollButton: 'bg-neutral-800 text-white p-1.5 rounded-full shadow-md hover:bg-neutral-600'
		}
	},
	modern: {
		colors: {
			background: 'bg-white',
			primaryText: 'text-black',
			secondaryText: 'text-neutral-500'
		},
		components: {
			socialButton: `bg-neutral-900 text-white p-1.5 rounded-lg shadow-md hover:bg-neutral-600`,
			scrollButton: `bg-neutral-900 text-white p-1.5 rounded-full shadow-md hover:bg-neutral-600`
		}
	},
	pink: {
		colors: {
			background: 'bg-pink-50',
			primaryText: 'text-black',
			secondaryText: 'text-neutral-500'
		},
		components: {
			socialButton: `bg-pink-500 text-white p-1.5 rounded-lg shadow-md hover:bg-pink-600`,
			scrollButton: `bg-pink-500 text-white p-1.5 rounded-full shadow-md hover:bg-pink-600`
		}
	},
	chicken: {
		colors: {
			background: 'bg-emerald-100',
			primaryText: 'text-green-500',
			secondaryText: 'text-purple-500'
		},
		components: {
			socialButton: `bg-pink-500 text-white p-1.5 rounded-lg shadow-md hover:bg-pink-600`,
			scrollButton: `bg-pink-500 text-white p-1.5 rounded-full shadow-md hover:bg-pink-600`
		}
	}
};

export default themes;
