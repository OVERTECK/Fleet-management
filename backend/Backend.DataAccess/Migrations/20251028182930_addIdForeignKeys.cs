using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addIdForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GasStations_Cars_CarVIN",
                table: "GasStations");

            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRecords_Cars_CarVIN",
                table: "MaintenanceRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_Targets_Cars_CarVIN",
                table: "Targets");

            migrationBuilder.DropForeignKey(
                name: "FK_Trips_Cars_CarVIN",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Trips_CarVIN",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Targets_CarVIN",
                table: "Targets");

            migrationBuilder.DropIndex(
                name: "IX_MaintenanceRecords_CarVIN",
                table: "MaintenanceRecords");

            migrationBuilder.DropIndex(
                name: "IX_GasStations_CarVIN",
                table: "GasStations");

            migrationBuilder.DropColumn(
                name: "CarVIN",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "CarVIN",
                table: "Targets");

            migrationBuilder.DropColumn(
                name: "CarVIN",
                table: "MaintenanceRecords");

            migrationBuilder.DropColumn(
                name: "CarVIN",
                table: "GasStations");

            migrationBuilder.AddColumn<string>(
                name: "CarId",
                table: "Trips",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CarId",
                table: "Targets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CarId",
                table: "MaintenanceRecords",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CarId",
                table: "GasStations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_CarId",
                table: "Trips",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_Targets_CarId",
                table: "Targets",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRecords_CarId",
                table: "MaintenanceRecords",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_GasStations_CarId",
                table: "GasStations",
                column: "CarId");

            migrationBuilder.AddForeignKey(
                name: "FK_GasStations_Cars_CarId",
                table: "GasStations",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "VIN",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRecords_Cars_CarId",
                table: "MaintenanceRecords",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "VIN",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Targets_Cars_CarId",
                table: "Targets",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "VIN",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_Cars_CarId",
                table: "Trips",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "VIN",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GasStations_Cars_CarId",
                table: "GasStations");

            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRecords_Cars_CarId",
                table: "MaintenanceRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_Targets_Cars_CarId",
                table: "Targets");

            migrationBuilder.DropForeignKey(
                name: "FK_Trips_Cars_CarId",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Trips_CarId",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Targets_CarId",
                table: "Targets");

            migrationBuilder.DropIndex(
                name: "IX_MaintenanceRecords_CarId",
                table: "MaintenanceRecords");

            migrationBuilder.DropIndex(
                name: "IX_GasStations_CarId",
                table: "GasStations");

            migrationBuilder.DropColumn(
                name: "CarId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "CarId",
                table: "Targets");

            migrationBuilder.DropColumn(
                name: "CarId",
                table: "MaintenanceRecords");

            migrationBuilder.DropColumn(
                name: "CarId",
                table: "GasStations");

            migrationBuilder.AddColumn<string>(
                name: "CarVIN",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CarVIN",
                table: "Targets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CarVIN",
                table: "MaintenanceRecords",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CarVIN",
                table: "GasStations",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Trips_CarVIN",
                table: "Trips",
                column: "CarVIN");

            migrationBuilder.CreateIndex(
                name: "IX_Targets_CarVIN",
                table: "Targets",
                column: "CarVIN");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRecords_CarVIN",
                table: "MaintenanceRecords",
                column: "CarVIN");

            migrationBuilder.CreateIndex(
                name: "IX_GasStations_CarVIN",
                table: "GasStations",
                column: "CarVIN");

            migrationBuilder.AddForeignKey(
                name: "FK_GasStations_Cars_CarVIN",
                table: "GasStations",
                column: "CarVIN",
                principalTable: "Cars",
                principalColumn: "VIN");

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRecords_Cars_CarVIN",
                table: "MaintenanceRecords",
                column: "CarVIN",
                principalTable: "Cars",
                principalColumn: "VIN");

            migrationBuilder.AddForeignKey(
                name: "FK_Targets_Cars_CarVIN",
                table: "Targets",
                column: "CarVIN",
                principalTable: "Cars",
                principalColumn: "VIN");

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_Cars_CarVIN",
                table: "Trips",
                column: "CarVIN",
                principalTable: "Cars",
                principalColumn: "VIN");
        }
    }
}
