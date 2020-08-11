class WorldMap {
    array:number[][]
    tilesize: number
    pivot: number
    constructor(tilesize, pivot){
        this.array = [
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 1, 1, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [1, 1, 1, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.tilesize = tilesize;
        this.pivot = pivot;
    }

    scaleToScreen(point){
        point.x = point.x*this.tilesize+this.pivot;
        point.y = point.y*this.tilesize+this.pivot;
    }

    getWaypoints(start) {
        let waypoints = [];
        waypoints.push({ x: start.x, y: start.y });

        //while (true) 
        for (let i = 0; i <= 9999; i++) {
            let neighbours = this.getNeighbours(this.array, waypoints[i]);

            neighbours = neighbours.filter((tile) => {
                let flag = true;
                waypoints.some((p) => {
                    if (p.x == tile.x && p.y == tile.y) {
                        flag = false;
                    }
                });
                return flag;
            });

            if (neighbours.length == 0) break;

            waypoints.push(neighbours[0]);
        }

        for (let i=0; i<waypoints.length; i++){
            waypoints[i].x=waypoints[i].x;
            waypoints[i].y=waypoints[i].y;
        }

        return waypoints;
    }

    //Map class?
    getNeighbours(map, tile) {
        let directions = [[0, 1], [1, 0]];

        let neighbours = [];

        for (let i = 0; i < 2; i++) {
            let dx1 = directions[i][0];
            let dy1 = directions[i][1];

            let dx2 = -directions[i][0];
            let dy2 = -directions[i][1];

            let x = tile.x + dx1;
            let y = tile.y + dy1;

            if (this.isValid(map, x, y) && map[y][x] == 1) neighbours.push({ x: x, y: y });
            x = tile.x + dx2;
            y = tile.y + dy2;
            if (this.isValid(map, x, y) && map[y][x] == 1) neighbours.push({ x: x, y: y });
        }

        return neighbours;
    }

    //Map class?
    isValid(map, j, i) {
        return i >= 0 && i < map.length && j >= 0 && j < map[i].length;
    }
}

export default WorldMap