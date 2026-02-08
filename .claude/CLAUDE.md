## This project interfaces with a postgres database backend for all of its queries. All queries are written in pure SQL and run from server side next js components.

# Below are the create table statements for every table in the database, to use as a reference for writing queries for the frontend

CREATE TABLE IF NOT EXISTS team (
    id uuid PRIMARY KEY,
    name varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tournament_team (
    id uuid PRIMARY KEY,
    player_id VARCHAR(500) REFERENCES player(steam_id),
    team_id uuid REFERENCES team(id),
    tournament_name varchar(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS player (
    steam_id VARCHAR(500) PRIMARY KEY,
    name varchar(255) NOT NULL,
    team_id uuid REFERENCES team(id)
);

CREATE TABLE IF NOT EXISTS match (
    id uuid PRIMARY KEY,
    team_one_id uuid NOT NULL REFERENCES team(id),
    team_two_id uuid NOT NULL REFERENCES team(id),
    map varchar(100) NOT NULL,
    file varchar(500) NOT NULL,
    tournament varchar(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS round (
    id uuid PRIMARY KEY,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    freeze_time_end_tick int NOT NULL,
    end_official_tick int NOT NULL,
    round_end_reason varchar(255) NOT NULL,
    t_rounds int NOT NULL,
    ct_rounds int NOT NULL,
    t_team_id uuid NOT NULL REFERENCES team(id),
    ct_team_id uuid NOT NULL REFERENCES team(id),
    winning_side varchar(16) NOT NULL,
    winning_team_id uuid NOT NULL REFERENCES team(id),
    losing_side varchar(16) NOT NULL,
    losing_team_id uuid NOT NULL REFERENCES team(id)
);

CREATE TABLE IF NOT EXISTS plant (
    id uuid PRIMARY KEY,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    round_id uuid NOT NULL REFERENCES round(id) ON DELETE CASCADE,
    tick int NOT NULL,
    site VARCHAR(2) NOT NULL,
    x float NOT NULL,
    y float NOT NULL,
    z float NOT NULL
);

CREATE TABLE IF NOT EXISTS kill (
    id uuid PRIMARY KEY,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    round_id uuid NOT NULL REFERENCES round(id) ON DELETE CASCADE,
    assister_id VARCHAR(32) REFERENCES player(steam_id),
    attacker_id VARCHAR(32) REFERENCES player(steam_id),
    victim_id VARCHAR(32) REFERENCES player(steam_id),
    attacker_team_id uuid REFERENCES team(id),
    assister_team_id uuid REFERENCES team(id),
    victim_team_id uuid NOT NULL REFERENCES team(id),
    attacker_x float,
    attacker_y float,
    attacker_z float,
    attacker_zone VARCHAR(32),
    victim_x float NOT NULL,
    victim_y float NOT NULL,
    victim_z float NOT NULL,
    victim_zone VARCHAR(32),
    assistedflash bool NOT NULL,
    attackerblind bool NOT NULL,
    attackerinair bool NOT NULL,
    headshot bool NOT NULL,
    noscope bool NOT NULL,
    penetrated int NOT NULL,
    thrusmoke bool NOT NULL,
    distance float,
    dmg_armor int NOT NULL,
    dmg_health int NOT NULL,
    hitgroup varchar(255) NOT NULL,
    weapon varchar(255) NOT NULL,
    victim_weapon varchar(255),
    attacker_team varchar(255),
    assister_team varchar(255),
    victim_team varchar(255),
    t_alive int NOT NULL,
    ct_alive int NOT NULL,
    trade bool NOT NULL,
    traded bool NOT NULL,
    tick int NOT NULL
);

CREATE TABLE IF NOT EXISTS damage (
    id uuid PRIMARY KEY,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    round_id uuid NOT NULL REFERENCES round(id) ON DELETE CASCADE,
    attacker_id VARCHAR(32) REFERENCES player(steam_id),
    victim_id VARCHAR(32) NOT NULL REFERENCES player(steam_id),
    attacker_x float,
    attacker_y float,
    attacker_z float,
    attacker_zone VARCHAR(32),
    victim_x float NOT NULL,
    victim_y float NOT NULL,
    victim_z float NOT NULL,
    victim_zone VARCHAR(32),
    armor int NOT NULL,
    health int NOT NULL,
    dmg_armor int NOT NULL,
    dmg_health int NOT NULL,
    hitgroup VARCHAR(32) NOT NULL,
    tick int NOT NULL,
    weapon VARCHAR(255) NOT NULL,
    attacker_team varchar(255),
    victim_team varchar(255)
);

CREATE TABLE IF NOT EXISTS player_default (
    id uuid PRIMARY KEY,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    round_id uuid NOT NULL REFERENCES round(id) ON DELETE CASCADE,
    player_id VARCHAR(32) NOT NULL REFERENCES player(steam_id),
    team_id uuid NOT NULL REFERENCES team(id),
    side VARCHAR(32) NOT NULL,
    zone VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS weapon_fire (
    id uuid PRIMARY KEY,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    round_id uuid NOT NULL REFERENCES round(id) ON DELETE CASCADE,
    attacker_id VARCHAR(32) REFERENCES player(steam_id),
    attacker_x float NOT NULL,
    attacker_y float NOT NULL,
    attacker_z float NOT NULL,
    attacker_zone VARCHAR(32),
    attacker_pitch float NOT NULL,
    attacker_yaw float NOT NULL,
    attacker_team VARCHAR(255) NOT NULL,
    tick int NOT NULL,
    weapon VARCHAR(255) NOT NULL,
    silenced boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS buy (
    id uuid PRIMARY KEY,
    player_id VARCHAR(500) NOT NULL REFERENCES player(steam_id),
    round_id uuid NOT NULL REFERENCES round(id) ON DELETE CASCADE,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    team_id uuid NOT NULL REFERENCES team(id),
    side VARCHAR(32) NOT NULL,
    equipment_value int NOT NULL,
    balance int NOT NULL
);

CREATE TABLE IF NOT EXISTS message (
    id uuid PRIMARY KEY,
    player_id VARCHAR(32) NOT NULL REFERENCES player(steam_id),
    round_id uuid NOT NULL REFERENCES round(id) ON DELETE CASCADE,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    message VARCHAR(255),
    tick int NOT NULL
);

CREATE TABLE IF NOT EXISTS grenade (
    id uuid PRIMARY KEY,
    player_id VARCHAR(32) NOT NULL REFERENCES player(steam_id),
    team_id uuid NOT NULL REFERENCES team(id),
    round_id uuid NOT NULL REFERENCES round(id) ON DELETE CASCADE,
    match_id uuid NOT NULL REFERENCES match(id) ON DELETE CASCADE,
    team VARCHAR(32) NOT NULL,
    grenade_type VARCHAR(32) NOT NULL,
    start_tick int NOT NULL,
    start_x float NOT NULL,
    start_y float NOT NULL,
    start_z float NOT NULL,
    start_zone VARCHAR(32),
    end_tick int NOT NULL,
    end_x float NOT NULL,
    end_y float NOT NULL,
    end_z float NOT NULL,
    end_zone VARCHAR(32)
);