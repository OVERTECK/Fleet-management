using System.Text.Json.Serialization;

namespace Backend.DataAccess.Entities;

public class RouteEntity
{
    public required Guid Id { get; set; }

    public required double Latitude { get; set; }

    public required double Longitude { get; set; }

    // public required string Address { get; set; }

    // public required DateTime TimeStamp { get; set; }

    public required Guid TripId { get; set; }

    [JsonIgnore]
    public TripEntity? Trip { get; set; }
}