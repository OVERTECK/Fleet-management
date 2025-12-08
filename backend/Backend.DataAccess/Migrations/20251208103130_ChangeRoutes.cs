using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRoutes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountKM",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "End",
                table: "Routes");

            migrationBuilder.RenameColumn(
                name: "Start",
                table: "Routes",
                newName: "TimeStamp");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Routes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Routes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Routes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<Guid>(
                name: "TripId",
                table: "Routes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Routes_TripId",
                table: "Routes",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_Routes_Trips_TripId",
                table: "Routes",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Routes_Trips_TripId",
                table: "Routes");

            migrationBuilder.DropIndex(
                name: "IX_Routes_TripId",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "TripId",
                table: "Routes");

            migrationBuilder.RenameColumn(
                name: "TimeStamp",
                table: "Routes",
                newName: "Start");

            migrationBuilder.AddColumn<int>(
                name: "CountKM",
                table: "Routes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "End",
                table: "Routes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
