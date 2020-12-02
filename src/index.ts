import joplin from 'api';
// import { MenuItem, MenuItemLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function () {
		// const COMMANDS = joplin.commands;
		// const DATA = joplin.data;
		const PANELS = joplin.views.panels;
		const SETTINGS = joplin.settings;
		const WORKSPACE = joplin.workspace;

		await SETTINGS.registerSection('com.brainpad.joplin.statusbar.settings', {
			label: 'Status Bar',
			iconName: 'fas fa-info-circle',
		});

		await SETTINGS.registerSetting('tabHeight', {
			value: '20',
			type: 1,
			section: 'com.brainpad.joplin.statusbar.settings',
			public: true,
			label: 'Status Bar height (px)'
		});

		// Advanced styles
		await SETTINGS.registerSetting('mainBackground', {
			value: 'var(--joplin-background-color3)',
			type: 2,
			section: 'com.brainpad.joplin.statusbar.settings',
			public: true,
			advanced: true,
			label: 'Background color'
		});
		await SETTINGS.registerSetting('mainForeground', {
			value: 'var(--joplin-color-faded)',
			type: 2,
			section: 'com.brainpad.joplin.statusbar.settings',
			public: true,
			advanced: true,
			label: 'Foreground color'
		});

		// prepare panel object
		const panel = await PANELS.create('com.brainpad.joplin.statusbar.panel');
		await PANELS.addScript(panel, './webview.css');
		await PANELS.addScript(panel, './webview.js');

		// update HTML content
		async function updateStatusBarPanel() {
			// get style values from settings
			const height: number = await SETTINGS.value('tabHeight');
			const mainBg: string = await SETTINGS.value('mainBackground');
			const mainFg: string = await SETTINGS.value('mainForeground');

			// status bar value
      const panelValue = 'Last Sync: ' + new Date().toLocaleString();

			// update status bar panel
			await PANELS.setHtml(panel, `
				  <div class="container" style="height:${height}px;background:${mainBg};color:${mainFg};">
						<div style="padding-right: 4px">
							${panelValue}
						</div>
					</div>
				`);
		}

		WORKSPACE.onSyncComplete(() => {
			// TODO: how to update when sync is in progress?
			updateStatusBarPanel();
		});

		updateStatusBarPanel();
	},
});
