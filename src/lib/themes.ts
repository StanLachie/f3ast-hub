const themes = {
	default: {
		colors: {
			background: 'bg-white',
			text: 'text-black'
		},
		components: {
			socialButton: `bg-white border border-neutral-100 text-neutral-900 p-1.5 rounded-lg shadow-md hover:bg-neutral-100`,
			scrollButton: `bg-white border border-neutral-100 text-neutral-900 p-1.5 rounded-full shadow-md hover:bg-neutral-100`
		}
	},
	modern: {
		colors: {
			background: 'bg-white',
			text: 'text-black'
		},
		components: {
			socialButton: `bg-neutral-900 text-white p-1.5 rounded-lg shadow-md hover:bg-neutral-600`,
			scrollButton: `bg-neutral-900 text-white p-1.5 rounded-full shadow-md hover:bg-neutral-600`
		}
	},
	pink: {
		colors: {
			background: 'bg-pink-50',
			text: 'text-white'
		},
		components: {
			socialButton: `bg-pink-500 text-white p-1.5 rounded-lg shadow-md hover:bg-pink-600`,
			scrollButton: `bg-pink-500 text-white p-1.5 rounded-full shadow-md hover:bg-pink-600`
		}
	},
	chicken: {
		colors: {
			background: 'bg-pink-200',
			text: 'text-white'
		},
		components: {
			socialButton: `bg-pink-500 text-white p-1.5 rounded-lg shadow-md hover:bg-pink-600`,
			scrollButton: `bg-pink-500 text-white p-1.5 rounded-full shadow-md hover:bg-pink-600`
		}
	}
};

export default themes;
