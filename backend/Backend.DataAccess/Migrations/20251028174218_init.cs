using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cars",
                columns: table => new
                {
                    VIN = table.Column<string>(type: "text", nullable: false),
                    Model = table.Column<string>(type: "text", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    TotalKM = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cars", x => x.VIN);
                });

            migrationBuilder.CreateTable(
                name: "Drivers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Pathronymic = table.Column<string>(type: "text", nullable: false),
                    ContactData = table.Column<string>(type: "text", nullable: false),
                    CategoryDrive = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drivers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Start = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    End = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CountKM = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GasStations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CarVIN = table.Column<string>(type: "text", nullable: true),
                    RefilledLiters = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GasStations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GasStations_Cars_CarVIN",
                        column: x => x.CarVIN,
                        principalTable: "Cars",
                        principalColumn: "VIN");
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CarVIN = table.Column<string>(type: "text", nullable: true),
                    TypeWork = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaintenanceRecords_Cars_CarVIN",
                        column: x => x.CarVIN,
                        principalTable: "Cars",
                        principalColumn: "VIN");
                });

            migrationBuilder.CreateTable(
                name: "Targets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CarVIN = table.Column<string>(type: "text", nullable: true),
                    DriverId = table.Column<Guid>(type: "uuid", nullable: false),
                    Start = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    End = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Targets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Targets_Cars_CarVIN",
                        column: x => x.CarVIN,
                        principalTable: "Cars",
                        principalColumn: "VIN");
                    table.ForeignKey(
                        name: "FK_Targets_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Trips",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CarVIN = table.Column<string>(type: "text", nullable: true),
                    DriverId = table.Column<Guid>(type: "uuid", nullable: false),
                    TimeStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TimeEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TraveledKM = table.Column<int>(type: "integer", nullable: false),
                    ConsumptionLitersFuel = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Trips_Cars_CarVIN",
                        column: x => x.CarVIN,
                        principalTable: "Cars",
                        principalColumn: "VIN");
                    table.ForeignKey(
                        name: "FK_Trips_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GasStations_CarVIN",
                table: "GasStations",
                column: "CarVIN");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRecords_CarVIN",
                table: "MaintenanceRecords",
                column: "CarVIN");

            migrationBuilder.CreateIndex(
                name: "IX_Targets_CarVIN",
                table: "Targets",
                column: "CarVIN");

            migrationBuilder.CreateIndex(
                name: "IX_Targets_DriverId",
                table: "Targets",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_CarVIN",
                table: "Trips",
                column: "CarVIN");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_DriverId",
                table: "Trips",
                column: "DriverId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GasStations");

            migrationBuilder.DropTable(
                name: "MaintenanceRecords");

            migrationBuilder.DropTable(
                name: "Routes");

            migrationBuilder.DropTable(
                name: "Targets");

            migrationBuilder.DropTable(
                name: "Trips");

            migrationBuilder.DropTable(
                name: "Cars");

            migrationBuilder.DropTable(
                name: "Drivers");
        }
    }
}
