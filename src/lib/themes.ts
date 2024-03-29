const themes = {
	default: {
		colors: {
			defaultBackground: 'bg-white',
			primaryBackground: 'bg-neutral-900',
			secondaryBackground: 'bg-neutral-200',
			defaultBorder: 'border-white',
			primaryBorder: 'border-neutral-900',
			secondaryBorder: 'border-neutral-200',
			defaultText: 'text-black',
			primaryText: 'text-white',
			secondaryText: 'text-neutral-500'

			// background: 'bg-white',
			// secondaryBackground: 'bg-neutral-200',
			// primaryText: 'text-black',
			// secondaryText: 'text-neutral-500'
		},
		components: {
			socialButton: `bg-neutral-900 text-white p-1.5 rounded-lg shadow-md hover:bg-neutral-600`,
			scrollButton: `bg-neutral-900 text-white p-1.5 rounded-full shadow-md hover:bg-neutral-600`
		}
	},
	dark: {
		colors: {
			background: 'bg-neutral-900',
			secondaryBackground: 'bg-neutral-800',
			primaryText: 'text-neutral-100',
			secondaryText: 'text-neutral-300'
		},
		components: {
			socialButton: 'bg-neutral-800 text-white p-1.5 rounded-lg shadow-md hover:bg-neutral-600',
			scrollButton: 'bg-neutral-800 text-white p-1.5 rounded-full shadow-md hover:bg-neutral-600'
		}
	},
	cream: {
		colors: {
			background: 'bg-[#efdfc5]',
			secondaryBackground: 'bg-[#e7cea7]',
			primaryText: 'text-[#1a1006]',
			secondaryText: 'text-[#412a10]'
		},
		components: {
			socialButton: `bg-[#1a1006] text-[#efdfc5] p-1.5 rounded-md shadow-md hover:bg-[#412a10]`,
			scrollButton: `bg-[#1a1006] text-[#efdfc5] p-1.5 rounded-full shadow-md hover:bg-[#412a10]`
		}
	},
	pine: {
		colors: {
			background: 'bg-[#e1d3bc]',
			secondaryBackground: 'bg-[#d6c3a4]',
			primaryText: 'text-[#456140]',
			secondaryText: 'text-neutral-700'
		},
		components: {
			socialButton: `bg-[#456140] text-[#e1d3bc] p-1.5 rounded-full shadow-md hover:bg-[#354a31]`,
			scrollButton: `bg-[#456140] text-[#e1d3bc] p-1.5 rounded-full shadow-md hover:bg-[#354a31]`
		}
	},
	chocolate: {
		colors: {
			background: 'bg-[#271E16]',
			secondaryBackground: 'bg-[#453527]',
			primaryText: 'text-neutral-50',
			secondaryText: 'text-neutral-200'
		},
		components: {
			socialButton: `bg-neutral-50 text-[#271E16] p-1.5 rounded-full shadow-md hover:bg-neutral-300`,
			scrollButton: `bg-neutral-50 text-[#271E16] p-1.5 rounded-full shadow-md hover:bg-neutral-300`
		}
	},

	lavender: {
		colors: {
			background: 'bg-neutral-50',
			secondaryBackground: 'bg-neutral-200',
			primaryText: 'text-neutral-800',
			secondaryText: 'text-neutral-700'
		},
		components: {
			socialButton: `bg-purple-400 text-neutral-50 p-1.5 rounded-lg shadow-md hover:bg-purple-500`,
			scrollButton: `bg-purple-400 text-neutral-50 p-1.5 rounded-full shadow-md hover:bg-purple-500`
		}
	},
	amber: {
		colors: {
			defaultBackground: 'bg-neutral-900',
			primaryBackground: 'bg-orange-400',
			secondaryBackground: 'bg-neutral-800',
			defaultBorder: 'border-neutral-900',
			primaryBorder: 'border-orange-400',
			secondaryBorder: 'border-neutral-800',
			defaultText: 'text-white',
			primaryText: 'text-neutral-950',
			secondaryText: 'text-neutral-300'
		},
		components: {
			categoryFinder: '',
			categoryButton: 'text-neutral-900',
			socialButton: `bg-orange-400 text-neutral-950 p-1.5 rounded-md shadow-md hover:bg-orange-500`,
			scrollButton: `bg-orange-400 text-neutral-950 p-1.5 rounded-full shadow-md hover:bg-orange-500`
		}
	},
	bubblegum: {
		colors: {
			background: 'bg-pink-50',
			secondaryBackground: 'bg-[#fcdeef]',
			primaryText: 'text-pink-500',
			secondaryText: 'text-pink-400'
		},
		components: {
			socialButton: `bg-pink-500 text-white p-1.5 rounded-full shadow-md hover:bg-pink-600`,
			scrollButton: `bg-pink-500 text-white p-1.5 rounded-full shadow-md hover:bg-pink-600`
		}
	},
	f3ast: {
		colors: {
			background: 'bg-neutral-50',
			secondaryBackground: 'bg-neutral-200',
			primaryText: 'text-black',
			secondaryText: 'text-neutral-600'
		},
		components: {
			socialButton: `bg-emerald-300 text-neutral-950 p-1.5 rounded-lg shadow-md hover:bg-emerald-400 border border-emerald-950`,
			scrollButton: `bg-emerald-300 text-neutral-950 p-1.5 rounded-lg shadow-md hover:bg-emerald-400 border border-emerald-950`
		}
	},
	pluto: {
		colors: {
			background: 'bg-neutral-800',
			secondaryBackground: 'bg-neutral-700',
			primaryText: 'text-[#00aeef]',
			secondaryText: 'text-neutral-100'
		},
		components: {
			socialButton: `bg-[#00aeef] text-neutral-800 p-1.5 rounded-lg shadow-md hover:bg-[#0494c9]`,
			scrollButton: `bg-[#00aeef] text-neutral-800 p-1.5 rounded-full shadow-md hover:bg-[#0494c9]`
		}
	},
	ocean: {
		colors: {
			background: 'bg-blue-50',
			secondaryBackground: 'bg-blue-100',
			primaryText: 'text-sky-500',
			secondaryText: 'text-[#58c9f9]'
		},
		components: {
			socialButton: `bg-sky-500 text-blue-50 p-1.5 rounded-full shadow-md hover:bg-sky-600`,
			scrollButton: `bg-sky-500 text-blue-50 p-1.5 rounded-full shadow-md hover:bg-sky-600`
		}
	}
};

export default themes;
