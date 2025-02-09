/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Gio = imports.gi.Gio;
const Gettext = imports.gettext;
const GObject = imports.gi.GObject;

var _ = Gettext.domain("dock-from-dash").gettext
Gettext.bindtextdomain("dock-from-dash", ExtensionUtils.getCurrentExtension().path + "/locale");

let settings;

function init() {
    settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.dock-from-dash');
}


function buildPrefsWidget() {
    let frame = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL,
                              margin_top: 10,
                              margin_bottom: 10,
                              margin_start: 10,
                              margin_end: 10,
                              spacing: 10});

    let showOverview = buildSwitcher('show-overview',_("Show overview at startup"));
    frame.append(showOverview);

    let alwaysShow = buildSwitcher('always-show',_("Always show the dock"));
    frame.append(alwaysShow);

    let hide = buildDropDown('hide',_("When to hide the dock"), ['Never', 'Maximized Window', 'Auto Hide'], 'always-show');
    frame.append(hide);

    let showInFullScreen = buildSwitcher('show-in-full-screen',_("Show dock in full screen mode"));
    frame.append(showInFullScreen);

    let backgroundOpacity = buildSpinButton('background-opacity',_("Dock background opacity (%)"), 0, 100, 5);
    frame.append(backgroundOpacity);

    let iconsOpacity = buildSpinButton('icons-opacity',_("Dock icons opacity (%)"), 0, 100, 5);
    frame.append(iconsOpacity);

    let hideTimeout = buildSpinButton('autohide-delay',_("Delay for dock autohide (ms)"), 0, 1000, 50);
    frame.append(hideTimeout);

    let toggleDelay = buildSpinButton('toggle-delay',_("Delay for dock showing (ms)"), 0, 1000, 50);
    frame.append(toggleDelay);

    let usePressure = buildSwitcher('use-pressure',_("Require pressure to show the dock"));
    frame.append(usePressure);

    let pressureThreshold = buildSpinButton('pressure-threshold',_("Pressure threshold for dock showing"), 0, 1000, 50, 'use-pressure');
    frame.append(pressureThreshold);

    let showDockDuration = buildSpinButton('show-dock-duration',_("Duration of dock showing animation (ms)"), 0, 1000, 50);
    frame.append(showDockDuration);

    let hideDockDuration = buildSpinButton('hide-dock-duration',_("Duration of dock hiding animation (ms)"), 0, 1000, 50);
    frame.append(hideDockDuration);

    frame.show();
    return frame;
}

function buildSwitcher(key, labelText) {
    let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
    let label = new Gtk.Label({ label: labelText, xalign: 0 });
    let switcher = new Gtk.Switch({ active: settings.get_boolean(key) });

    label.set_hexpand(true);
    switcher.set_hexpand(false);
    switcher.set_halign(Gtk.Align.END);
    settings.bind(key, switcher, 'active', 3);

    hbox.append(label);
    hbox.append(switcher);

    return hbox;
}

function buildDropDown(key, labelText, options, depends = null) {
    let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
    let label = new Gtk.Label({ label: labelText, xalign: 0 });
    let drop_down = Gtk.DropDown.new_from_strings(options);

    label.set_hexpand(true);
    drop_down.set_hexpand(false);
    drop_down.set_halign(Gtk.Align.END);
    drop_down.selected = settings.get_int(key);
    settings.bind(key, drop_down, 'selected', 3);

    if (depends !== null)
        settings.bind(depends, drop_down, 'sensitive', 3);

    hbox.append(label);
    hbox.append(drop_down);

    return hbox;
}

function buildSpinButton(key, labeltext, minval, maxval, step_increment, depends = null) {
    let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
    let label = new Gtk.Label({label: labeltext, xalign: 0 });
    let adjust = new Gtk.Adjustment({lower: minval, upper: maxval, value: settings.get_int(key), step_increment: step_increment});
    let spin = new Gtk.SpinButton({digits: 0, adjustment: adjust});

    label.set_hexpand(true);
    spin.set_hexpand(false);
    spin.set_halign(Gtk.Align.END);
    settings.bind(key, adjust, 'value', 3);

    if (depends !== null)
        settings.bind(depends, spin, 'sensitive', 3);

    hbox.append(label);
    hbox.append(spin);

    return hbox;
}
