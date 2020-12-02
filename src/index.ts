import joplin from 'api';

joplin.plugins.register({
	onStart: async function () {
		const PANELS = joplin.views.panels;
		const WORKSPACE = joplin.workspace;

		// prepare panel object
		const panel = await PANELS.create('com.brainpad.joplin.statusbar.panel');
		await PANELS.addScript(panel, './webview.css');

		// update HTML content
		async function updateStatusBarPanel() {
			// status bar value
      const panelValue = 'Last Sync: ' + new Date().toLocaleString();

			// update status bar panel
			await PANELS.setHtml(panel, `
				  <div class="container">
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
	}
});
